// src/features/auth/model/useCreateNewPassword.ts

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { FieldValues } from "react-hook-form"

import { ROUTES } from "@/common/constants/route"
import { useRateLimitCooldown } from "@/common/hooks/useRateLimitCooldown"
import { getRetryAfterSeconds, isApiErrorMatching } from "@/common/utils/api/error"
import { apiAuth } from "@/features/auth/api/apiAuth"

const DEFAULT_RATE_LIMIT_SECONDS = 10

type UseCreateNewPasswordParams<TFormValues extends FieldValues> = {
  onSuccess?: () => void
  rateLimitStorageKey?: string
}

export const useCreateNewPassword = <TFormValues extends FieldValues>({
  onSuccess,
  rateLimitStorageKey = "rate-limit:create-new-password",
}: UseCreateNewPasswordParams<TFormValues>) => {
  const router = useRouter()

  const { cooldown, isCooldownActive, startCooldown, resetCooldown } = useRateLimitCooldown({
    storageKey: rateLimitStorageKey,
  })

  const mutation = useMutation({
    mutationFn: apiAuth.createNewPassword,

    meta: {
      silentErrors: [
        {
          status: 400,
          code: "VALIDATION_ERROR",
        },
      ],
    },

    onSuccess: () => {
      onSuccess?.()
    },

    onError: (error) => {
      if (isApiErrorMatching(error, { status: 429, code: "TOO_MANY_REQUESTS" })) {
        startCooldown(getRetryAfterSeconds(error) ?? DEFAULT_RATE_LIMIT_SECONDS)

        return
      }

      if (isApiErrorMatching(error, { status: 422, code: "INVALID_RECOVERY_CODE" })) {
        router.push(ROUTES.recoveryLinkExpired)
        return
      }

      if (isApiErrorMatching(error, { status: 404, code: "NOT_FOUND" })) {
        router.push(ROUTES.forgotPassword)
        return
      }
    },
  })

  return {
    ...mutation,
    cooldown,
    isCooldownActive,
    resetCooldown,
  }
}
