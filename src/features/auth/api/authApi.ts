import { ApiError, RegisterRequest } from "@/features/auth/api/authApi.types"

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
}

export const authService = new AuthService()
