import { ACCESS_TOKEN_COOKIE } from "@/common/constants/auth"

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_COOKIE)
}

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_COOKIE, accessToken)
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${accessToken}; path=/; max-age=${ACCESS_TOKEN_MAX_AGE}; samesite=lax`
}

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_COOKIE)
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`
}
