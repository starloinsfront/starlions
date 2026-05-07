import { useMutation } from "@tanstack/react-query"
import { client } from "@/shared/api/client"

export const useRegistrationConfirmation = () => {
  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const response = await client.POST("/api/v1/auth/registration-confirmation", {
        body: { code },
      })

      if (response.error) {
        throw response.error
      }

      return response.data
    },
  })
}
