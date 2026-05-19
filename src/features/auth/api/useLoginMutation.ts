import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiAuth } from "@/features/auth/api/apiAuth"
import { ACCESS_TOKEN_COOKIE } from "@/common/constants/auth"
import { useRouter } from "next/navigation"

export const useLoginMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiAuth.SignIn,
    onSuccess: (response) => {
      if (response?.accessToken) {
        localStorage.setItem("accessToken", response.accessToken)
        document.cookie = `${ACCESS_TOKEN_COOKIE}=${response.accessToken}; path=/; max-age=18000; samesite=lax`
      }

      queryClient.invalidateQueries({ queryKey: ["user"] })

      router.push("/profile")
    },
    onError: (error: Error) => {
      console.error("Login error:", error)
    },
  })
}
