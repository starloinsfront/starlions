"use client"

import { ROUTES } from "@/common/constants/route"
import { setAccessToken } from "@/common/utils/auth/accessToken"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"

/**
 * Landing page after OAuth when the backend redirects with a bearer token in the query string.
 * Backend must use the **frontend** URL, e.g. `https://dev.it-incubator.ru:3000${ROUTES.oauthComplete}?accessToken=...`
 * — not `https://gateway.../api/v1/auth?...` (that path does not exist on the API).
 */
function OAuthCompleteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) {
      return
    }
    ran.current = true

    const err = searchParams?.get("error")

    if (err) {
      router.replace(`${ROUTES.signIn}?error=${encodeURIComponent(err)}`)

      return
    }

    const raw =
      searchParams?.get("accessToken") ??
      searchParams?.get("access_token") ??
      searchParams?.get("token")

    const token = raw?.trim()

    if (!token) {
      router.replace(`${ROUTES.signIn}?error=${encodeURIComponent("missing_token")}`)

      return
    }

    setAccessToken(token)
    void queryClient.invalidateQueries({ queryKey: ["me"] })

    // Full navigation so the protected layout RSC request includes the new cookie.
    window.location.replace(ROUTES.profile)
  }, [queryClient, router, searchParams])

  return <p>Completing sign-in…</p>
}

export default function OAuthCompletePage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <OAuthCompleteContent />
    </Suspense>
  )
}
