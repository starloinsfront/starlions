import { useMutation } from "@tanstack/react-query"

import { ROUTES } from "@/common/constants/route"
import { isApiErrorMatching } from "@/common/utils/api/error"
import { apiAuth } from "@/features/auth/api/apiAuth"
import { useRouter } from "next/navigation"

export const useRegistrationConfirmation = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: apiAuth.RegistrationConfirmation,
    onError: (error) => {
      if (isApiErrorMatching(error, { code: "BAD_REQUEST", status: 400 })) {
        router.replace(ROUTES.signIn)
      }
    },
  })
}
