# Изменения для бэкенда: Google OAuth (тех-долг)

> Репозиторий: `starlions-backend`, ветка `develop`.
> Этот документ — **спецификация изменений** для backend-команды. Сам код здесь не применяется.
> Связанный фронтенд-ревью: `google-oauth-review.md`.

---

## Сводка

| # | Severity | Файл | Суть |
|---|----------|------|------|
| 1 | 🔴 Критично | `apps/api-gateway/.../auth.controller.ts` | Захардкожен URL фронтенда в `googleCallback` |
| 2 | 🔴 Критично | `apps/api-gateway/.../auth.controller.ts` (+ config) | `redirect_uri` нигде не обрабатывается |
| 3 | 🟠 Безопасность | `apps/api-gateway/.../auth.controller.ts` | `accessToken` уходит в URL query string |
| 5 | 🟠 Безопасность | `oauth-state.service.ts` + `auth.controller.ts` | `state` не привязан к браузеру (слабая CSRF) |
| 7 | 🟡 Качество | `google-oauth-login.handler.ts` + контракт | `GoogleLoginResponse.isNewUser` не используется |

(Нумерация сохранена из общего ревью; #4, #6, #8 — чисто фронтендовые.)

---

## #1 — Вынести URL фронтенда в конфиг

**Проблема.** В `googleCallback` захардкожен прод-домен:

```ts
const frontendUrl = 'https://starlionstech.org/auth/google/callback';
```

Из-за этого Google-вход на любом не-прод стенде (dev/stage/локально) всё равно редиректит на прод.

**Решение.** Добавить переменную окружения и поле в `GatewayCoreConfig`, читать оттуда.

`apps/api-gateway/.env.*`:

```dotenv
# Куда gateway редиректит браузер после успешного/неуспешного Google OAuth
FRONTEND_OAUTH_REDIRECT_URL=https://starlionstech.org/auth/google/callback
```

`apps/api-gateway/src/core/gateway.core.config.ts` — добавить геттер:

```ts
get frontendOAuthRedirectUrl(): string {
  return this.configService.getOrThrow<string>('FRONTEND_OAUTH_REDIRECT_URL');
}
```

`auth.controller.ts` → `googleCallback`:

```ts
// было: const frontendUrl = 'https://starlionstech.org/auth/google/callback';
const frontendUrl = this.config.frontendOAuthRedirectUrl;
```

---

## #2 — Решить судьбу `redirect_uri`

**Проблема.** Фронт умеет добавлять `?redirect_uri=...`, но `GET /auth/google` его не читает — `OAuth2Client` всегда строится с фиксированным `config.googleCallbackUrl`.

**Вариант A (рекомендуется, минимум изменений):** официально НЕ поддерживать `redirect_uri`. Тогда на фронте удаляется флаг `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK` (см. фронт-ревью). На бэке менять ничего не нужно — просто зафиксировать договорённость.

**Вариант B (если нужны несколько стендов с разными доменами):** принимать `redirect_uri`, **валидировать по all-list** и прокидывать в стор состояния, чтобы использовать в callback-редиректе:

`auth.controller.ts`:

```ts
@Get('google')
async googleAuth(
  @Res() res: Response,
  @Query('redirect_uri') redirectUri?: string,
): Promise<void> {
  const safeRedirect = this.config.resolveAllowedRedirect(redirectUri); // throws/falls back, если не в allow-list
  const { state, nonce } = await this.oauthStateService.generate(safeRedirect);
  const authUrl = this.googleOAuthService.buildAuthUrl(state, nonce);

  res.redirect(authUrl);
}
```

`oauth-state.service.ts` — хранить `redirectUri` рядом со `state`/`nonce` (например, JSON-значение в Redis), и возвращать его из `verify()` для использования в `googleCallback`.

> **Не** передавать `redirect_uri` в `OAuth2Client` без валидации — это open-redirect / возможный обход.

---

## #3 — Убрать `accessToken` из URL

**Проблема.** Сейчас:

```ts
res.redirect(`${frontendUrl}?accessToken=${result.value.accessToken}`);
```

Токен утекает в историю браузера, заголовок `Referer`, логи nginx/прокси.

**Решение (рекомендуется).** Редиректить **без токена**, а access-token фронт получает отдельным запросом по уже выставленной refresh-cookie:

```ts
// refresh-token уже в HttpOnly-cookie — оставляем
res.cookie(cookieConfig.name, result.value.refreshToken, {
  httpOnly: cookieConfig.httpOnly,
  secure: cookieConfig.secure,
  sameSite: 'lax',
});

// редирект без токена
res.redirect(frontendUrl);
```

Фронт после приземления на callback дёргает `POST /auth/refresh-token` (cookie уедет автоматически) и получает `accessToken` в теле ответа — как в обычном логине.

**Альтернатива:** одноразовый короткоживущий `code`, который фронт меняет на токен через отдельный эндпоинт. Сложнее, но не зависит от cookie на кросс-доменном редиректе.

---

## #5 — Привязать `state` к браузеру (CSRF)

**Проблема.** `state` лежит в Redis глобально; `verify` лишь проверяет наличие ключа. Перехваченные `state`+`code` можно завершить в чужом браузере.

**Решение.** Дополнительно класть `state` в короткоживущую HttpOnly-cookie при старте и сверять в callback.

`auth.controller.ts` → `googleAuth`:

```ts
const { state, nonce } = await this.oauthStateService.generate();
res.cookie('oauth_state', state, {
  httpOnly: true,
  secure: cookieConfig.secure,
  sameSite: 'lax',
  maxAge: 5 * 60 * 1000,
});
res.redirect(this.googleOAuthService.buildAuthUrl(state, nonce));
```

`auth.controller.ts` → `googleCallback` (до проверки в Redis):

```ts
@Get('google/callback')
async googleCallback(
  // ...
  @Query('state') state: string,
  @Req() req: Request, // добавить
): Promise<void> {
  const frontendUrl = this.config.frontendOAuthRedirectUrl;

  const cookieState = req.cookies?.['oauth_state'];
  if (!cookieState || cookieState !== state) {
    res.redirect(`${frontendUrl}?error=unauthorized`);
    return;
  }
  res.clearCookie('oauth_state', { httpOnly: true, sameSite: 'lax' });

  // дальше — существующая логика: verify(state) в Redis, exchangeCodeAndVerify, ...
}
```

> Требует включённого `cookie-parser` на gateway (проверить в `main.ts` / `app.setup.ts`).

---

## #7 — Привести в порядок `isNewUser`

**Проблема.** В контракте поле есть, но не заполняется и не используется:

```ts
// libs/shared/src/contracts/account/oauth.types.ts
export interface GoogleLoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean; // ← мёртвое
}
```

`GoogleOauthLoginHandler` возвращает только `AuthTokenResponse` (без `isNewUser`).

**Вариант A (полезнее для UX).** Прокидывать `isNewUser`, чтобы фронт вёл нового пользователя на заполнение профиля.

`google-oauth-login.handler.ts`:

```ts
private async findExistOrCreateUser(
  cmd: GoogleOauthLoginCommand,
): Promise<{ userId: string; username: string; isNewUser: boolean }> {
  // сценарий 1 / 2 → isNewUser: false
  // сценарий 3 (создание) → isNewUser: true
}

async execute(cmd: GoogleOauthLoginCommand): Promise<Result<AuthTokenResponse & { isNewUser: boolean }>> {
  const { userId, username, isNewUser } = await this.findExistOrCreateUser(cmd);
  const { accessToken, refreshToken } = await this.tokenSession.createSessionWithTokens({ /* ... */ });

  return Result.ok({ accessToken, refreshToken, isNewUser });
}
```

Тогда в `googleCallback` можно добавить флаг в редирект (например `?new=1`), а фронт отправит нового пользователя на онбординг.

**Вариант B (минимализм).** Просто удалить `isNewUser` из `GoogleLoginResponse`.

---

## Чек-лист (backend, ветка `develop`)

- [ ] #1: добавить `FRONTEND_OAUTH_REDIRECT_URL` в `.env.*` и геттер в `GatewayCoreConfig`; заменить хардкод.
- [ ] #2: зафиксировать вариант A (убрать поддержку) **или** реализовать allow-list для `redirect_uri` (вариант B).
- [ ] #3: убрать `accessToken` из query; отдавать через refresh-cookie / one-time code.
- [ ] #5: добавить `oauth_state` HttpOnly-cookie и сверку в callback (проверить `cookie-parser`).
- [ ] #7: прокинуть `isNewUser` в ответ **или** удалить из контракта.
- [ ] Обновить Swagger-аннотации эндпоинтов `/auth/google` и `/auth/google/callback`.
- [ ] Прогнать `pnpm lint` и тесты.

> Все правки — отдельной feature-веткой (например `feat/oauth-google-hardening`) и PR в `develop`, по конвенции репозитория.
