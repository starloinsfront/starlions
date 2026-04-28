import { useState } from "react"
import { authApi } from "@/features/auth/api/authApi"

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    try {
      return await authApi.logout()
    } finally {
      setIsLoading(false)
    }
  }
  return { isLoading, logout }
}
