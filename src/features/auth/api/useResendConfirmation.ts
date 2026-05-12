import { useMutation } from "@tanstack/react-query"
import { client } from "@/shared/api/client"

export const useResendConfirmation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await client.POST("/api/v1/auth/registration-email-resending", {
        body: {
          email: email,
        },
      })

      if (response.error) {
        throw response.error
      }

      return response.data
    },
  })
}
