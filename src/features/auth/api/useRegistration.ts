import { useMutation } from "@tanstack/react-query"

import { apiAuth } from "@/features/auth/api/apiAuth"
import { isApiError } from "@/common/utils/api/error/apiError"

export const useRegistration = () => {
  return useMutation({
    mutationFn: apiAuth.registrationUser,
    onError: (error) => {
      if (isApiError(error)) {
        console.log("API ERROR:", error.status)
        console.log("DATA:", error.data)
        return
      }

      console.log("UNKNOWN ERROR:", error)
    },
  })
}
