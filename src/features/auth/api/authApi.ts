import {
  ApiError,
  ConfirmRegistrationRequest,
  RegisterRequest,
} from "@/features/auth/api/authApi.types"
class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL

  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      const error: ApiError = {
        status: response.status,
        data: errorData,
      }
      throw error
    }

    if (response.status === 204) {
      return
    }
    return response.json()
  }
  async confirmRegistration(data: ConfirmRegistrationRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/registration-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (response.status === 204) {
      return
    }

    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        status: 400,
        data: errorData,
        message: errorData.message || "Invalid or expired confirmation code",
      }
    }

    if (response.status === 404) {
      throw {
        status: 404,
        data: await response.json().catch(() => ({})),
        message: "User not found",
      }
    }

    const errorData = await response.json().catch(() => ({}))
    throw {
      status: response.status,
      data: errorData,
      message: errorData.message || "Confirmation failed",
    }
  }
}

export const authService = new AuthService()
