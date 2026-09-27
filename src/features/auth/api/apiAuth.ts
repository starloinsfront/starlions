import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import { isApiErrorMatching } from "@/common/utils/api/error/serverError"
import { client } from "@/common/api/client"
import type {
  SchemaEmailInputDto,
  SchemaNewPasswordInputDto,
  SchemaPasswordRecoveryInputDto,
} from "@/common/api/schema"
import { clearAccessToken, getAccessToken, setAccessToken } from "@/common/utils/auth/accessToken"
import { RegisterFormData } from "@/features/auth/model/register.schema"

import { SignInFormData } from "@/features/auth/model/auth-schemas"

const AUTH_BOOTSTRAP_TIMEOUT_MS = 4_000

export  const getAuthHeaders = () => {
  const accessToken = getAccessToken()

  if (!accessToken) {
    return undefined
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

const requestAuthMe = async (signal?: AbortSignal) => {
  const result = await client.GET("/api/v1/auth/me", {
    headers: getAuthHeaders(),
    signal,
  })

  return handleApiResponse(result, "Auth me request failed")
}

const refreshAccessToken = async (signal?: AbortSignal) => {
  const result = await client.POST("/api/v1/auth/refresh-token", { signal })
  const data = handleApiResponse(result, "Refresh token request failed")

  if (data?.accessToken) {
    setAccessToken(data.accessToken)
  }

  return data
}

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
  refreshToken: async () => {
    return refreshAccessToken()
  },
  authMe: async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AUTH_BOOTSTRAP_TIMEOUT_MS)

    try {
      if (!getAccessToken()) {
        try {
          await refreshAccessToken(controller.signal)
        } catch {
          clearAccessToken()

          return null
        }
      }

      try {
        return await requestAuthMe(controller.signal)
      } catch (error) {
        if (!isApiErrorMatching(error, { status: 401 })) {
          throw error
        }

        try {
          await refreshAccessToken(controller.signal)

          return await requestAuthMe(controller.signal)
        } catch {
          clearAccessToken()

          return null
        }
      }
    } finally {
      clearTimeout(timeoutId)
    }
  },
}
