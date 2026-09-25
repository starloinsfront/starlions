import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { client } from "@/common/api/client"
import { ROUTES } from "@/common/constants/route"
import { clearAccessToken } from "@/common/utils/auth/accessToken"
import { getAuthHeaders } from "@/features/auth/api/apiAuth"

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.POST("/api/v1/auth/sign-out", {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSettled: async () => {
      await queryClient.cancelQueries({
        queryKey: ["me"],
      })

      clearAccessToken()
      queryClient.setQueryData(["me"], null)
      router.replace(ROUTES.signIn)
    },
  })

  return mutation
}
