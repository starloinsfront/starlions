import { useMutation } from "@tanstack/react-query"

import { getRetryAfterSeconds, isApiErrorMatching } from "@/common/utils/api/error"
import { apiAuth } from "@/features/auth/api/apiAuth"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/common/constants/route"
import { useRateLimitCooldown } from "@/common/hooks/useRateLimitCooldown"
import { showInfoToast, showSuccessToast } from "@/common/utils/toast/showToast"
import { useEmailFormErrorHandling } from "../model/useEmailFormErrorHandling"
import { FieldValues, UseFormSetError } from "react-hook-form"

const DEFAULT_RATE_LIMIT_SECONDS = 10

type Params<TFormValues extends FieldValues> = {
  setError: UseFormSetError<TFormValues>
}

export const useResendConfirmation = <TFormValues extends FieldValues>({
  setError,
}: Params<TFormValues>) => {
  const router = useRouter()

  const { cooldown, isCooldownActive, startCooldown } = useRateLimitCooldown({
    storageKey: "rate-limit:confirm-email",
  })

  const handleEmailFormError = useEmailFormErrorHandling<TFormValues>({
    setError,
    message: "User with this email doesn't exist",
  })

  const mutation = useMutation({
    mutationFn: apiAuth.ResendConfirmation,
    meta: {
      silentErrors: [
        {
          status: 400,
          code: "BAD_REQUEST",
        },
        {
          status: 404,
          code: "NOT_FOUND",
        },
      ],
    },

    onSuccess: () => {
      showSuccessToast("We have sent a link to confirm your email")
    },

    onError: (error) => {
      if (isApiErrorMatching(error, { code: "BAD_REQUEST", status: 400 })) {
        showInfoToast("Email is already confirmed. Please sign in.")
        router.replace(ROUTES.signIn)
      }

      if (isApiErrorMatching(error, { status: 429, code: "TOO_MANY_REQUESTS" })) {
        startCooldown(getRetryAfterSeconds(error) ?? DEFAULT_RATE_LIMIT_SECONDS)

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
