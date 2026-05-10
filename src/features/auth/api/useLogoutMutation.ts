import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/shared/api/client"
import { useRouter } from "next/navigation"

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.POST("/api/v1/auth/logout", {
        body: {
          refreshToken: localStorage.getItem("refresh-token")!,
        },
      })
      return response.data
    },
    onSuccess: () => {
      localStorage.removeItem("refresh-token")
      localStorage.removeItem("access-token")
      queryClient.resetQueries({
        queryKey: ["auth", "me"],
      })
      router.push("/auth/login")
    },
  })

  return mutation
}
