import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiAuth } from "@/features/auth/api/apiAuth"
import { setAccessToken } from "@/common/utils/auth/accessToken"
import { useRouter } from "next/navigation"

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

      router.push("/profile")
    },
    onError: (error: Error) => {
      console.error("Login error:", error)
    },
  })
}
