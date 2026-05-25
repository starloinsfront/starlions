import { useMutation } from "@tanstack/react-query"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import { useRateLimitCooldown } from "@/common/hooks/useRateLimitCooldown"
import { getRetryAfterSeconds, isApiErrorMatching } from "@/common/utils/api/error"
import { apiAuth } from "@/features/auth/api/apiAuth"

import { useEmailFormErrorHandling } from "./useEmailFormErrorHandling"

const DEFAULT_RATE_LIMIT_SECONDS = 10

type UsePasswordRecoveryParams<TFormValues extends FieldValues> = {
  setError: UseFormSetError<TFormValues>
  emailFieldName?: Path<TFormValues>
  recaptchaFieldName?: Path<TFormValues>
  onInvalidRecaptcha?: () => void
  onSuccess?: (email: string) => void
  rateLimitStorageKey?: string
}

export const usePasswordRecovery = <TFormValues extends FieldValues>({
  setError,
  emailFieldName,
  recaptchaFieldName,
  onInvalidRecaptcha,
  onSuccess,
  rateLimitStorageKey = "rate-limit:password-recovery",
}: UsePasswordRecoveryParams<TFormValues>) => {
  const { isCooldownActive, startCooldown } = useRateLimitCooldown({
    storageKey: rateLimitStorageKey,
  })

  const handleEmailFormError = useEmailFormErrorHandling<TFormValues>({
    setError,
    emailFieldName,
  })

  const mutation = useMutation({
    mutationFn: apiAuth.passwordRecovery,

    meta: {
      silentErrors: [
        {
          status: 404,
          code: "NOT_FOUND",
        },
        {
          status: 500,
          code: "INVALID_RECAPTCHA",
        },
      ],
    },

    onSuccess: (_data, variables) => {
      onSuccess?.(variables.email)
    },

    onError: (error) => {
      if (isApiErrorMatching(error, { status: 429, code: "TOO_MANY_REQUESTS" })) {
        startCooldown(getRetryAfterSeconds(error) ?? DEFAULT_RATE_LIMIT_SECONDS)

        return
      }

      if (isApiErrorMatching(error, { status: 500, code: "INVALID_RECAPTCHA" })) {
        onInvalidRecaptcha?.()

        setError(recaptchaFieldName ?? ("recaptchaToken" as Path<TFormValues>), {
          type: "server",
          message: "Please verify that you are not a robot",
        })

        return
      }

      handleEmailFormError(error)
    },
  })

  return {
    ...mutation,
    isCooldownActive,
  }
}
