import { ACCESS_TOKEN_COOKIE } from "@/common/constants/auth"

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_COOKIE)
}

export const setAccessToken = (accessToken: string) => {
  const trimmed = accessToken.trim()

  localStorage.setItem(ACCESS_TOKEN_COOKIE, trimmed)

  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:"

  const secureFlag = isHttps ? "; secure" : ""

  document.cookie = `${ACCESS_TOKEN_COOKIE}=${trimmed}; path=/; max-age=${ACCESS_TOKEN_MAX_AGE}; samesite=lax${secureFlag}`
}

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_COOKIE)
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`
}
