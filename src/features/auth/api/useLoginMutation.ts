import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/shared/api/client"
import { SignInFormData } from "@/features/auth/model/auth-schemas"

export const useLoginMutation = () => {
  const callbackUrl = "http://localhost:3000"
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: SignInFormData) => {
      const response = await client.POST("/api/v1/auth/sign-in", {
        email: body.email,
        password: body.password,
      })
    },
  })
}
