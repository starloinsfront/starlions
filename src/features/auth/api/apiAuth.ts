import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import { client } from "@/common/api/client"
import type {
  SchemaEmailInputDto,
  SchemaNewPasswordInputDto,
  SchemaPasswordRecoveryInputDto,
} from "@/common/api/schema"
import { RegisterFormData } from "@/features/auth/model/register.schema"
import { useRegistrationConfirmation } from "@/features/auth/api/useRegistrationConfirmation"
import { useResendConfirmation } from "@/features/auth/api/useResendConfirmation"
import { SignInFormData } from "@/features/auth/model/auth-schemas"

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
  registrationUser: async (data: RegisterFormData) => {
    const result = await client.POST("/api/v1/auth/registration", {
      body: data,
    })
    return handleApiResponse(result, "Registration registration request failed")
  },
  RegistrationConfirmation: async ({ code }: { code: string }) => {
    const result = await client.POST("/api/v1/auth/registration-confirmation", {
      body: { code },
    })
    return handleApiResponse(result, "Registration Confirmation request failed")
  },
  ResendConfirmation: async (email: string) => {
    const result = await client.POST("/api/v1/auth/registration-email-resending", {
      body: {
        email: email,
      },
    })
    return handleApiResponse(result, "Registration Email resending")
  },
  SignIn: async (data: SignInFormData) => {
    const result = await client.POST("/api/v1/auth/sign-in", {
      body: {
        email: data.email,
        password: data.password,
      },
    })

    return handleApiResponse(result, "Sign in request failed")
  },
}
