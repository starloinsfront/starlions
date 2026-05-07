// features/auth/hooks/useAuthError.ts
import { useCallback } from "react"

export type AuthErrorType =
  | "registration"
  | "login"
  | "passwordReset"
  | "changePassword"
  | "verification"

interface UseAuthErrorOptions {
  type?: AuthErrorType
  customMessages?: Record<string, string>
}

// вњ… Р”РѕР±Р°РІР»СЏРµРј РїР°СЂР°РјРµС‚СЂ options РІ С…СѓРє
export function useAuthError(options: UseAuthErrorOptions = {}) {
  const { type = "login", customMessages = {} } = options

  const getErrorMessage = useCallback(
    (error: unknown): string => {
      if (!error) return ""

      const apiError = error as any
      const status = apiError?.status
      const data = apiError?.data

      // РљР°СЃС‚РѕРјРЅС‹Рµ СЃРѕРѕР±С‰РµРЅРёСЏ РґР»СЏ РєРѕРЅРєСЂРµС‚РЅС‹С… СЃР»СѓС‡Р°РµРІ
      if (customMessages[`status_${status}`]) {
        return customMessages[`status_${status}`]
      }

      // РћР±С‰РёРµ РѕС€РёР±РєРё РґР»СЏ РІСЃРµС… С‚РёРїРѕРІ
      if (status === 429) {
        return "Too many attempts. Please try again later."
      }

      if (status === 500) {
        return "Server error. Please try again later."
      }

      if (!status || status === 0) {
        return "Network error. Please check your connection."
      }

      // РЎРїРµС†РёС„РёС‡РЅС‹Рµ РѕС€РёР±РєРё РІ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё РѕС‚ С‚РёРїР°
      switch (type) {
        case "registration":
          return getRegistrationErrorMessage(status, data)

        case "login":
          return getLoginErrorMessage(status, data)

        case "passwordReset":
          return getPasswordResetErrorMessage(status, data)

        case "changePassword":
          return getChangePasswordErrorMessage(status, data)

        case "verification":
          return getVerificationErrorMessage(status, data)

        default:
          return data?.message || "Something went wrong. Please try again."
      }
    },
    [type, customMessages],
  )

  return { getErrorMessage }
}

// РҐРµР»РїРµСЂС‹ РґР»СЏ СЂР°Р·РЅС‹С… С‚РёРїРѕРІ РѕС€РёР±РѕРє (РѕСЃС‚Р°СЋС‚СЃСЏ Р±РµР· РёР·РјРµРЅРµРЅРёР№)
function getRegistrationErrorMessage(status: number, data: any): string {
  if (status === 400) {
    const message = data?.message?.toLowerCase() || ""

    if (message.includes("email") || data?.errors?.email) {
      return "User with this email is already registered"
    }
    if (message.includes("username") || data?.errors?.username) {
      return "User with this username is already registered"
    }

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]
      if (firstError && Array.isArray(firstError)) {
        return firstError[0]
      }
    }

    return data?.message || "Invalid registration data"
  }

  return "Registration failed. Please try again."
}

function getLoginErrorMessage(status: number, data: any): string {
  if (status === 401) {
    return "Invalid email or password"
  }

  if (status === 403) {
    return "Your account is not verified. Please check your email."
  }

  if (status === 400) {
    return data?.message || "Invalid login credentials"
  }

  return "Login failed. Please try again."
}

function getPasswordResetErrorMessage(status: number, data: any): string {
  if (status === 404) {
    return "User with this email not found"
  }

  if (status === 400) {
    return data?.message || "Invalid email format"
  }

  return "Password reset failed. Please try again."
}

function getChangePasswordErrorMessage(status: number, data: any): string {
  if (status === 400) {
    if (data?.message?.includes("current password")) {
      return "Current password is incorrect"
    }
    return data?.message || "Invalid password data"
  }

  return "Password change failed. Please try again."
}

function getVerificationErrorMessage(status: number, data: any): string {
  if (status === 400) {
    return "Invalid or expired verification link"
  }

  if (status === 404) {
    return "Verification code not found"
  }

  return "Email verification failed"
}
