"use client"

import { ROUTES } from "@/common/constants/route"
import { getPublicApiBaseUrl } from "@/common/utils/auth/startGoogleOAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function GoogleOAuthCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const oauthError = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    if (oauthError) {
      const message = errorDescription ?? oauthError

      router.replace(`${ROUTES.signIn}?error=${encodeURIComponent(message)}`)

      return
    }

    const code = searchParams.get("code")

    if (!code) {
      router.replace(`${ROUTES.signIn}?error=${encodeURIComponent("missing_oauth_params")}`)

      return
    }

    const apiBase = getPublicApiBaseUrl()
    const params = new URLSearchParams({ code })
    const state = searchParams.get("state")

    if (state) {
      params.set("state", state)
    }

    window.location.replace(`${apiBase}/api/v1/auth/google/callback?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
      <p>Signing in with Google…</p>
    </div>
  )
}

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
          <p>Loading…</p>
        </div>
      }
    >
      <GoogleOAuthCallbackContent />
    </Suspense>
  )
}
