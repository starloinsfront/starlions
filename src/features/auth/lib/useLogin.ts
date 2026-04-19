import { useState } from "react"

import { authApi } from "@/features/auth/api/authApi"
import type { LoginArgs } from "@/features/auth/api/authApi.types"

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)

  const login = async (data: LoginArgs) => {
    setIsLoading(true)

    try {
      return await authApi.login(data)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, login }
}
