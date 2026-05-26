import { ACCESS_TOKEN_COOKIE } from "@/common/constants/auth"

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24

const readCookie = (name: string) => {
  if (typeof document === "undefined") {
    return null
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`))

  return match ? decodeURIComponent(match[1]) : null
}

export const getAccessToken = () => {
  return readCookie(ACCESS_TOKEN_COOKIE)
}

export const setAccessToken = (accessToken: string) => {
  if (typeof document === "undefined") {
    return
  }

  const trimmed = accessToken.trim()

  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:"

  const secureFlag = isHttps ? "; secure" : ""

  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(trimmed)}; path=/; max-age=${ACCESS_TOKEN_MAX_AGE}; samesite=lax${secureFlag}`
}

export const clearAccessToken = () => {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`
}
