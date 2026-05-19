import { useMutation } from "@tanstack/react-query"

import { apiAuth } from "@/features/auth/api/apiAuth"
import { isApiError } from "@/common/utils/api/error/apiError"

export const useResendConfirmation = () => {
  return useMutation({
    mutationFn: apiAuth.ResendConfirmation,

    onError: (error) => {
      if (isApiError(error)) {
        console.log("RESEND CONFIRMATION ERROR:", error.status)
        console.log("DATA:", error.data)
        return
      }

      console.log("UNKNOWN ERROR:", error)
    },
  })
}
