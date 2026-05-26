import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiAuth } from "@/features/auth/api/apiAuth"
import { setAccessToken } from "@/common/utils/auth/accessToken"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/common/constants/route"

export const useLoginMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiAuth.SignIn,

    onSuccess: (response) => {
      if (response?.accessToken) {
        setAccessToken(response.accessToken)
      }

      queryClient.invalidateQueries({ queryKey: ["me"] })
      router.push(ROUTES.profile)
    },
  })
}
