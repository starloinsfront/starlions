import { ROUTES } from "@/common/constants/route"

export const getPublicApiBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  if (base) {
    return base
  }

  return "https://gateway.starlionstech.org"
}

/** Registered Google redirect URI for the current browser origin. */
export const getGoogleOAuthRedirectUri = () => {
  if (typeof window === "undefined") {
    return ""
  }

  return `${window.location.origin}${ROUTES.googleOAuthCallback}`
}

/**
 * Full URL to start Google OAuth on the gateway (GET).
 * When `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK=true`, includes `redirect_uri`
 * only if `window` is available (browser).
 */
export const getGoogleOAuthStartUrl = (): string => {
  const apiBase = getPublicApiBaseUrl()

  if (process.env.NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK !== "true") {
    return `${apiBase}/api/v1/auth/google`
  }

  const redirect = getGoogleOAuthRedirectUri()

  if (!redirect) {
    return `${apiBase}/api/v1/auth/google`
  }

  return `${apiBase}/api/v1/auth/google?redirect_uri=${encodeURIComponent(redirect)}`
}

/**
 * Starts Google OAuth via gateway.
 *
 * By default we do **not** send `redirect_uri`, so Google returns to the gateway
 * callback (`…/api/v1/auth/google/callback`). That matches the usual Nest/passport
 * setup and avoids `redirect_uri` mismatch on the token exchange (often surfaces
 * as `error=unauthorized`).
 *
 * Set `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK=true` only if the backend
 * explicitly supports `redirect_uri` and exchanges the code using the same URL
 * registered in Google Cloud (your app origin + {@link ROUTES.googleOAuthCallback}).
 */
export const startGoogleOAuth = () => {
  window.location.href = getGoogleOAuthStartUrl()
}
