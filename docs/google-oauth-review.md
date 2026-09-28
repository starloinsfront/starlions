# Код-ревью: Регистрация и авторизация через Google (OAuth)

> Обзор сквозного потока Google OAuth (frontend `starlions` + backend `starlions-backend`, ветка `develop`).
> Договорённость: **бэкенд-ветку не трогаем** — все исправления применяются только во фронтенде.

---

## Как сейчас устроен поток

1. **Фронт:** пользователь жмёт кнопку → `GoogleOAuthLaunchLink` ведёт на `GET {gateway}/api/v1/auth/google`.
2. **Бэк** (`auth.controller.ts` → `googleAuth`): генерирует `state` + `nonce`, кладёт в Redis (TTL 5 мин), редиректит на Google.
3. **Google** → `GET /api/v1/auth/google/callback?code&state`.
4. **Бэк** (`googleCallback`): проверяет `state` в Redis (одноразово), меняет `code` на токены, верифицирует `id_token` + `nonce` + `email_verified`.
5. **Хендлер** `GoogleOauthLoginHandler`: три сценария — найден по провайдеру / привязка по email / создание нового пользователя с автогенерацией username.
6. **Бэк** ставит refresh-token в HttpOnly-cookie и редиректит на фронт с `?accessToken=...`.
7. **Фронт** (`/auth/google/callback` или `/auth/oauth-complete`): кладёт `accessToken` в cookie, инвалидирует `me`, ведёт в профиль.

Архитектура в целом грамотная: state/nonce-защита, верификация `id_token`, Result-паттерн, разделение слоёв. Но есть ряд проблем — от критичных до косметических.

---

## Сводная таблица замечаний

| # | Severity | Где | Суть | Можно чинить на фронте? |
|---|----------|-----|------|--------------------------|
| 1 | 🔴 Критично | Backend | Захардкожен URL фронтенда в `googleCallback` | ❌ только бэк |
| 2 | 🔴 Критично | Backend + Frontend | `redirect_uri` с фронта молча игнорируется | ⚠️ фронт-часть (убрать флаг) |
| 3 | 🟠 Безопасность | Backend + Frontend | `accessToken` передаётся в URL query string | ⚠️ только смягчение |
| 4 | 🟠 Безопасность | Frontend | `accessToken` в не-HttpOnly cookie (XSS) | ✅ частично |
| 5 | 🟠 Безопасность | Backend | `state` не привязан к браузеру (слабая CSRF) | ❌ только бэк |
| 6 | 🟡 Качество | Frontend | Дублирующийся «двухрежимный» callback — мёртвый код | ✅ да |
| 7 | 🟡 Качество | Backend | `GoogleLoginResponse.isNewUser` не используется | ❌ только бэк |
| 8 | 🟡 Качество | Frontend | Хрупкий `requestAnimationFrame`-хак вместо `useSearchParams` | ✅ да |

---

## 🔴 Критичные

### 1. Захардкоженный URL фронтенда в бэкенде *(требует бэкенда — вне scope)*
В `googleCallback` (`apps/api-gateway/.../auth.controller.ts`):

```ts
const frontendUrl = 'https://starlionstech.org/auth/google/callback';
```

- Прибит гвоздями prod-домен → **локальная разработка (`dev.it-incubator.ru:3000`) и любой другой стенд при Google-входе всегда улетают на прод**.
- Должно браться из конфига/env (например `config.frontendOAuthRedirectUrl`), как уже сделано для `googleCallbackUrl`.

### 2. `redirect_uri` с фронта молча игнорируется
Фронт умеет добавлять `?redirect_uri=...` (флаг `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK=true`), но `GET /auth/google` на бэке **никак не читает этот параметр** — `OAuth2Client` всегда строится с фиксированным `config.googleCallbackUrl`. То есть весь режим «frontend callback» на фронте — фактически мёртвый код, который создаёт ложное ощущение поддержки.

**Решение (фронт-часть):** удалить флаг и связанную логику (см. исправление #2 ниже).

---

## 🟠 Существенные (безопасность)

### 3. `accessToken` передаётся в URL query string
И редирект бэка (`?accessToken=...`), и чтение на фронте. Токен в URL утекает в историю браузера, `Referer`, логи прокси/nginx.

> Без изменений на бэке полностью убрать нельзя. На фронте можно лишь **сразу чистить query из истории** после извлечения токена (см. исправление #3 ниже).

### 4. `accessToken` хранится в обычной (не HttpOnly) cookie
`setAccessToken` пишет через `document.cookie` → доступен JS → уязвим к XSS. Refresh-token при этом правильно HttpOnly. Для access-token это распространённый компромисс, но стоит осознавать риск и минимизировать время жизни токена.

### 5. `state` не привязан к браузеру *(требует бэкенда — вне scope)*
`state` лежит в Redis глобально; `verify` лишь проверяет факт наличия ключа. Классическая практика — дополнительно класть `state` в HttpOnly-cookie и сверять.

---

## 🟡 Качество кода / поддерживаемость

### 6. Дублирующийся «двухрежимный» callback на фронте — частично мёртвый код
`/auth/google/callback` обрабатывает и `code` (форвард на gateway), и `accessToken`. Но в текущей схеме Google всегда редиректит на gateway, а тот — на фронт уже с `accessToken`. Ветка «форвард code на gateway» в штатном потоке недостижима. Плюс есть почти идентичная страница `/auth/oauth-complete`. Стоит оставить один путь.

### 7. `GoogleLoginResponse.isNewUser` объявлен, но не используется *(требует бэкенда — вне scope)*
В контракте поле есть, а хендлер возвращает только `AuthTokenResponse`. Полезно для онбординга (нового пользователя вести на заполнение профиля).

### 8. Хрупкий хак с `requestAnimationFrame`
В callback-странице для повторного чтения query-параметров — выглядит как обход гонки гидрации. Лучше через `useSearchParams()` (Suspense), как уже сделано в `oauth-complete`.

---

# Необходимые исправления (только фронтенд)

## Исправление #6 + #8 + #3: единый, упрощённый Google-callback

**Файл:** `src/app/(guest)/auth/google/callback/page.tsx`

Убираем мёртвую ветку форварда `code`, `requestAnimationFrame`-хак, переходим на `useSearchParams()` и **чистим URL** от токена сразу после извлечения.

```tsx
"use client"

import { ROUTES } from "@/common/constants/route"
import { setAccessToken } from "@/common/utils/auth/accessToken"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"

function readAccessToken(params: URLSearchParams | null) {
  const raw =
    params?.get("accessToken") ??
    params?.get("access_token") ??
    params?.get("token")

  return raw?.trim() || undefined
}

function GoogleOAuthCallbackContent() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) {
      return
    }
    ran.current = true

    const oauthError = searchParams?.get("error")
    const errorDescription = searchParams?.get("error_description")

    if (oauthError) {
      const message = errorDescription ?? oauthError

      router.replace(`${ROUTES.signIn}?error=${encodeURIComponent(message)}`)

      return
    }

    const token = readAccessToken(searchParams)

    if (!token) {
      router.replace(`${ROUTES.signIn}?error=${encodeURIComponent("missing_oauth_params")}`)

      return
    }

    setAccessToken(token)
    void queryClient.invalidateQueries({ queryKey: ["me"] })

    // Полная навигация, чтобы запрос защищённого layout (RSC) увидел новую cookie.
    // window.location.replace заменяет запись в истории — токен из URL не остаётся.
    window.location.replace(ROUTES.profile)
  }, [queryClient, router, searchParams])

  return (
    <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
      <p>Signing in with Google…</p>
    </div>
  )
}

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <GoogleOAuthCallbackContent />
    </Suspense>
  )
}
```

> После этого `/auth/google/callback` и `/auth/oauth-complete` делают одно и то же.
> Рекомендуется оставить **один** маршрут. Поскольку бэкенд жёстко редиректит на
> `…/auth/google/callback`, оставляем именно его, а `oauth-complete` можно удалить
> (или сделать реэкспортом, если на него где-то есть ссылки).

## Исправление #2: убрать неработающий режим `redirect_uri`

**Файл:** `src/common/utils/auth/startGoogleOAuth.ts`

Backend игнорирует `redirect_uri`, поэтому флаг `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK` только вводит в заблуждение. Упрощаем до единственного корректного варианта.

```ts
export const getPublicApiBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  return base || "https://gateway.starlionstech.org"
}

/**
 * URL старта Google OAuth на gateway (GET).
 * redirect_uri НЕ передаём: backend всегда использует свой зарегистрированный
 * callback (…/api/v1/auth/google/callback). Передача redirect_uri бэкендом
 * игнорируется и приводит к рассинхрону.
 */
export const getGoogleOAuthStartUrl = (): string => {
  return `${getPublicApiBaseUrl()}/api/v1/auth/google`
}

export const startGoogleOAuth = () => {
  window.location.href = getGoogleOAuthStartUrl()
}
```

**Файл:** `src/features/auth/ui/GoogleOAuthLaunchLink/GoogleOAuthLaunchLink.tsx`

Раз URL больше не зависит от `window`, `useSyncExternalStore` не нужен — серверный и клиентский снапшоты одинаковы.

```tsx
"use client"

import { Icon } from "@/common/components/Icon/Icon"
import { getGoogleOAuthStartUrl } from "@/common/utils/auth/startGoogleOAuth"

type GoogleOAuthLaunchLinkProps = {
  ariaLabel: string
  buttonClassName: string
  iconClassName: string
}

export const GoogleOAuthLaunchLink = ({
  ariaLabel,
  buttonClassName,
  iconClassName,
}: GoogleOAuthLaunchLinkProps) => {
  return (
    <a
      className={buttonClassName}
      href={getGoogleOAuthStartUrl()}
      aria-label={ariaLabel}
      rel="noopener noreferrer"
    >
      <Icon aria-hidden className={iconClassName} height={36} name={"googleFilled"} width={36} />
    </a>
  )
}
```

Также удалить переменную `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK` из `.env*`.

---

## Что остаётся бэкенду (вне текущего scope)

Эти пункты нельзя закрыть только на фронте — фиксируем как тех-долг для backend-команды:

1. **#1** — вынести `frontendUrl` в конфиг по окружениям (иначе dev-вход через Google нерабочий).
2. **#3** — перестать класть `accessToken` в URL; отдавать его через refresh-cookie / one-time code.
3. **#5** — привязать `state` к HttpOnly-cookie для полноценной CSRF-защиты.
4. **#7** — определиться с `isNewUser` (прокинуть или удалить из контракта).

---

## Чек-лист применения (frontend)

- [ ] Переписать `src/app/(guest)/auth/google/callback/page.tsx` (исправление #6/#8/#3).
- [ ] Решить судьбу `src/app/(guest)/auth/oauth-complete/page.tsx` (удалить дубль или оставить один маршрут).
- [ ] Упростить `src/common/utils/auth/startGoogleOAuth.ts` (исправление #2).
- [ ] Упростить `src/features/auth/ui/GoogleOAuthLaunchLink/GoogleOAuthLaunchLink.tsx`.
- [ ] Удалить `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK` из `.env*`.
- [ ] Прогнать `pnpm lint` и проверить сборку.
