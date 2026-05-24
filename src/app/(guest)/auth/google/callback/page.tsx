"use client"

import { ROUTES } from "@/common/constants/route"
import { setAccessToken } from "@/common/utils/auth/accessToken"
import { getPublicApiBaseUrl } from "@/common/utils/auth/startGoogleOAuth"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function readOAuthQuery() {
  return new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  )
}

function readAccessTokenFromParams(params: URLSearchParams) {
  const raw =
    params.get("accessToken") ??
    params.get("access_token") ??
    params.get("token")

  const trimmed = raw?.trim()

  return trimmed || undefined
}

/**
 * Two entry modes:
 * 1) Google returns `code` (+ optional `state`) — forward to gateway to finish OAuth.
 * 2) Backend already finished OAuth and redirects here with `accessToken` in the query
 *    (same shape as {@link ROUTES.oauthComplete}; some backends use this path by mistake).
 */
function GoogleOAuthCallbackContent() {
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    let cancelled = false
    let rafId = 0

    const finishWithAccessToken = (token: string) => {
      setAccessToken(token)
      void queryClient.invalidateQueries({ queryKey: ["me"] })
      window.location.replace(ROUTES.profile)
    }

    const forwardToGateway = (params: URLSearchParams) => {
      const code = params.get("code")

      if (!code) {
        router.replace(`${ROUTES.signIn}?error=${encodeURIComponent("missing_oauth_params")}`)

        return
      }

      const apiBase = getPublicApiBaseUrl()
      const gatewayParams = new URLSearchParams({ code })
      const state = params.get("state")

      if (state) {
        gatewayParams.set("state", state)
      }

      window.location.replace(`${apiBase}/api/v1/auth/google/callback?${gatewayParams.toString()}`)
    }

    const handleParams = (params: URLSearchParams) => {
      if (cancelled) {
        return
      }

      const oauthError = params.get("error")
      const errorDescription = params.get("error_description")

      if (oauthError) {
        const message = errorDescription ?? oauthError

        router.replace(`${ROUTES.signIn}?error=${encodeURIComponent(message)}`)

        return true
      }

      if (params.get("code")) {
        forwardToGateway(params)

        return true
      }

      const token = readAccessTokenFromParams(params)

      if (token) {
        finishWithAccessToken(token)

        return true
      }

      return false
    }

    const tryForward = () => {
      const params = readOAuthQuery()

      if (handleParams(params)) {
        return
      }

      rafId = requestAnimationFrame(() => {
        if (cancelled) {
          return
        }

        const retry = readOAuthQuery()

        if (handleParams(retry)) {
          return
        }

        router.replace(`${ROUTES.signIn}?error=${encodeURIComponent("missing_oauth_params")}`)
      })
    }

    tryForward()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [queryClient, router])

  return (
    <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
      <p>Signing in with Google…</p>
    </div>
  )
}

export default function GoogleOAuthCallbackPage() {
  return <GoogleOAuthCallbackContent />
}
