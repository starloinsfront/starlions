import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

import { ROUTES } from "@/common/constants/route"
import { useRateLimitCooldown } from "@/common/hooks/useRateLimitCooldown"
import { apiAuth } from "@/features/auth/api/apiAuth"

import { useEmailFormErrorHandling } from "./useEmailFormErrorHandling"
import { isApiErrorMatching, getRetryAfterSeconds } from "@/common/utils/api/error"

const DEFAULT_RATE_LIMIT_SECONDS = 10

type Params<TFormValues extends FieldValues> = {
  setError: UseFormSetError<TFormValues>
  emailFieldName?: Path<TFormValues>
  onSuccess?: (email: string) => void
  rateLimitStorageKey?: string
}

export const usePasswordRecoveryResend = <TFormValues extends FieldValues>({
  setError,
  emailFieldName,
  onSuccess,
  rateLimitStorageKey = "rate-limit:password-recovery-resend",
}: Params<TFormValues>) => {
  const router = useRouter()

  const { cooldown, isCooldownActive, startCooldown } = useRateLimitCooldown({
    storageKey: rateLimitStorageKey,
  })

  const handleEmailFormError = useEmailFormErrorHandling<TFormValues>({
    setError,
    emailFieldName,
  })

  const mutation = useMutation({
    mutationFn: apiAuth.passwordRecoveryResend,

    meta: {
      silentErrors: [
        {
          status: 404,
          code: "NOT_FOUND",
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

      if (isApiErrorMatching(error, { status: 400, code: "BAD_REQUEST" })) {
        router.push(ROUTES.forgotPassword)

        return
      }

      handleEmailFormError(error)
    },
  })

  return {
    ...mutation,
    cooldown,
    isCooldownActive,
  }
}
