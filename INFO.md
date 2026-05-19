# API Error Handling & Rate Limit Cooldown

## 1. Общая идея

В проекте обработка ошибок строится так:

```txt
apiAuth / apiSomething
  ↓
handleApiResponse
  ↓
throw ApiError
  ↓
TanStack Query
  ↓
global handleGlobalError + local onError
```

`handleApiResponse` превращает ошибку от `openapi-fetch` в `ApiError`, чтобы `TanStack Query` смог поймать её в `onError`.

Глобальный обработчик ошибок отвечает за общий toast/console.

Локальный `onError` в компоненте отвечает за конкретную бизнес-логику:

```txt
setError в форму
redirect
запуск cooldown
открытие modal
```

---

## 2. Как писать API-запрос

```ts
import { handleApiResponse } from "@/common/utils/api-error"
import { client } from "@/shared/api/client"

export const apiAuth = {
  passwordRecovery: async (data: SchemaPasswordRecoveryInputDto) => {
    const result = await client.POST("/api/v1/auth/password-recovery", {
      body: data,
    })

    return handleApiResponse(result, "Password recovery failed")
  },
}
```

Не нужно в каждом запросе вручную писать:

```ts
if (error) {
  throw ...
}
```

Для этого есть `handleApiResponse`.

---

## 3. Как обработать конкретную ошибку в компоненте

```ts
import {
  getServerErrorMessage,
  isApiErrorMatching,
} from "@/common/utils/api-error"

mutate(data, {
  onError: (error) => {
    if (isApiErrorMatching(error, { status: 404, code: "NOT_FOUND" })) {
      setError("email", {
        type: "server",
        message: getServerErrorMessage(error.data),
      })

      return
    }

    if (isApiErrorMatching(error, { status: 400, code: "BAD_REQUEST" })) {
      router.push(ROUTES.forgotPassword)

      return
    }
  },
})
```

`isApiErrorMatching` проверяет:

```txt
это ApiError?
это ошибка от backend?
совпадает ли status?
совпадает ли backend error code?
```

---

## 4. Как скрыть глобальный toast для конкретной ошибки

Если ошибка должна показываться только в форме, например:

```txt
404 NOT_FOUND -> ошибка под email
```

то нужно добавить `meta.silentErrors`:

```ts
const { mutate } = useMutation({
  mutationFn: apiAuth.passwordRecoveryResend,

  meta: {
    silentErrors: [
      {
        status: 404,
        code: "NOT_FOUND",
      },
    ],
  },
})
```

Это отключит глобальный toast только для этой ошибки.

Локальный `onError` всё равно сработает.

---

## 5. Как работает rate limit

Backend при превышении лимита возвращает:

```txt
429 TOO_MANY_REQUESTS
Retry-After: 10
```

Frontend должен:

```txt
1. Поймать 429.
2. Достать Retry-After.
3. Запустить cooldown.
4. Задизейблить кнопку.
```

---

## 6. Как использовать useRateLimitCooldown

```ts
import {
  getRetryAfterSeconds,
  isApiErrorMatching,
} from "@/common/utils/api-error"
import { useRateLimitCooldown } from "@/common/hooks/useRateLimitCooldown"
```

```ts
const {
  cooldown,
  isCooldownActive,
  startCooldown,
} = useRateLimitCooldown({
  storageKey: "rate-limit:password-recovery-resend",
})
```

В `onError`:

```ts
onError: (error) => {
  if (isApiErrorMatching(error, { status: 429, code: "TOO_MANY_REQUESTS" })) {
    startCooldown(getRetryAfterSeconds(error) ?? 10)

    return
  }
}
```

В кнопке:

```tsx
<Button
  type="submit"
  disabled={!isValid || isPending || isCooldownActive}
>
  {isCooldownActive
    ? `Try again in ${cooldown}s`
    : isPending
      ? "Loading..."
      : "Send Link Again"}
</Button>
```

---

## 7. Что хранится в cooldown

`useRateLimitCooldown` хранит не количество секунд, а дату окончания cooldown:

```ts
cooldownUntil = Date.now() + seconds * 1000
```

Это значение сохраняется в `localStorage`.

Поэтому cooldown:

```txt
сохраняется при переходах между страницами
сохраняется после закрытия вкладки
не сбрасывается при размонтировании компонента
```

---

## 8. Пример полной мутации

```ts
const {
  cooldown,
  isCooldownActive,
  startCooldown,
} = useRateLimitCooldown({
  storageKey: "rate-limit:password-recovery-resend",
})

const { mutate, isPending } = useMutation({
  mutationFn: apiAuth.passwordRecoveryResend,

  meta: {
    silentErrors: [
      {
        status: 404,
        code: "NOT_FOUND",
      },
    ],
  },
})

const onSubmit: SubmitHandler<FormValues> = (data) => {
  mutate(data, {
    onSuccess: () => {
      setOpen(true)
    },

    onError: (error) => {
      if (isApiErrorMatching(error, { status: 429, code: "TOO_MANY_REQUESTS" })) {
        startCooldown(getRetryAfterSeconds(error) ?? 10)

        return
      }

      if (isApiErrorMatching(error, { status: 404, code: "NOT_FOUND" })) {
        setError("email", {
          type: "server",
          message: getServerErrorMessage(error.data),
        })

        return
      }
    },
  })
}
```

---

## 9. Ответственность слоёв

```txt
apiAuth
  только делает запросы

handleApiResponse
  превращает error в ApiError

handleGlobalError
  показывает общий toast / console

component onError
  делает локальную бизнес-логику

useRateLimitCooldown
  отвечает только за таймер и disabled state
```

---

## 10. Правила

```txt
Не показывать технические backend-сообщения пользователю.

Не считать frontend cooldown защитой.
Backend всегда остаётся источником правды.

Для ожидаемых ошибок формы использовать meta.silentErrors.

Для 429 использовать Retry-After.

Для field errors использовать setError.
```
