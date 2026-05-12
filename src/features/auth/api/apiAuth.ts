import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import { client } from "@/common/api/client"
import type {
  SchemaEmailInputDto,
  SchemaNewPasswordInputDto,
  SchemaPasswordRecoveryInputDto,
} from "@/common/api/schema"

export const apiAuth = {
  createNewPassword: async (data: SchemaNewPasswordInputDto) => {
    const result = await client.POST("/api/v1/auth/password-recovery/new-password", {
      body: data,
    })

    return handleApiResponse(result, "Create new password request failed")
  },

  passwordRecovery: async (data: SchemaPasswordRecoveryInputDto) => {
    const result = await client.POST("/api/v1/auth/password-recovery", {
      body: data,
    })

    return handleApiResponse(result, "Password recovery request failed")
  },

  passwordRecoveryResend: async (data: SchemaEmailInputDto) => {
    const result = await client.POST("/api/v1/auth/password-recovery/resend", {
      body: data,
    })

    return handleApiResponse(result, "Password recovery resend failed")
  },
}
