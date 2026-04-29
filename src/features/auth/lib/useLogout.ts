"use client"

import { useState } from "react"
import { authApi } from "@/features/auth/api/authApi"
import { setIsLoggedIn } from "@/features/auth/model/authSlice"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const router = useRouter()

  const logout = async () => {
    setIsLoading(true)
    try {
      const res = await authApi.logout()
      if (res) {
        dispatch(setIsLoggedIn(false))
        router.push("/")
      }
    } finally {
      setIsLoading(false)
    }
  }
  return { isLoading, logout }
}
