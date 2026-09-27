import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { ROUTES } from "@/common/constants/route"
import { setAccessToken } from "@/common/utils/auth/accessToken"
import { apiAuth } from "@/features/auth/api/apiAuth"

export const useLoginMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiAuth.SignIn,

    onSuccess: async (response) => {
      if (response?.accessToken) {
        setAccessToken(response.accessToken)
      }

      await queryClient.invalidateQueries({
        exact: true,
        queryKey: ["me"],
        refetchType: "all",
      })

      router.replace(ROUTES.profile)
    },
  })
}
