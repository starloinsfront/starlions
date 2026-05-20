import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { client } from "@/common/api/client"
import { ROUTES } from "@/common/constants/route"
import { clearAccessToken } from "@/common/utils/auth/accessToken"

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.POST("/api/v1/auth/sign-out")
      return response.data
    },
    onSuccess: () => {
      clearAccessToken()
      queryClient.resetQueries({
        queryKey: ["me"],
      })
      router.push(ROUTES.signIn)
    },
  })

  return mutation
}
