import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/shared/api/client"
import { RegisterFormData } from "@/features/auth/model/register.schema"

export const useRegistration = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await client.POST("/api/v1/auth/registration", {
        body: data,
      })
      if (response.error) {
        throw new Error(JSON.stringify(response.error))
      }
      return response.data
    },
  })
}
