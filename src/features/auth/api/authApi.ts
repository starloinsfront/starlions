import type { LoginArgs, LoginResponse } from "@/features/auth/api/authApi.types"

export const authApi = {
  login: async (_data: LoginArgs): Promise<LoginResponse> => {
    return Promise.resolve({ isLoggedIn: true })
  },
  logout: async (): Promise<LoginResponse> => {
    return Promise.resolve({ isLoggedIn: false })
  },
}
