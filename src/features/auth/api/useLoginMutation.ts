import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiAuth } from "@/features/auth/api/apiAuth"
import { setAccessToken } from "@/common/utils/auth/accessToken"
import { useRouter } from "next/navigation"

export const useLoginMutation = (setError?: any) => {
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

    onError: (error: any) => {
      const extensions = error?.response?.data?.extensions || error?.data?.extensions

      if (extensions) {
        extensions.forEach((err: any) => {
          if (err.field === "email or password") {
            setError?.("email", {
              type: "server",
              message: err.message,
            })

            setError?.("password", {
              type: "server",
              message: err.message,
            })

            return
          }

          setError?.(err.field, {
            type: "server",
            message: err.message,
          })
        })

        return
      }

      setError?.("root", {
        type: "server",
        message: "Login failed",
      })
    },
  })
}
