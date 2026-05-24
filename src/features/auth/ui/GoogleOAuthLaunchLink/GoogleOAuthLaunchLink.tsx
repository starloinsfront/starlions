"use client"

import { Icon } from "@/common/components/Icon/Icon"
import { getGoogleOAuthStartUrl, getPublicApiBaseUrl } from "@/common/utils/auth/startGoogleOAuth"
import { useSyncExternalStore } from "react"

type GoogleOAuthLaunchLinkProps = {
  ariaLabel: string
  buttonClassName: string
  iconClassName: string
}

const noopSubscribe = () => () => {}

/** SSR / hydration: no `window`, so never append `redirect_uri` here. */
const getGoogleOAuthHrefServerSnapshot = () => {
  return `${getPublicApiBaseUrl()}/api/v1/auth/google`
}

/**
 * Native `<a href>` so OAuth works even when SVG sprite `<use>` breaks click bubbling.
 * Client snapshot may add `redirect_uri` when `NEXT_PUBLIC_GOOGLE_OAUTH_USE_FRONTEND_CALLBACK=true`.
 */
export const GoogleOAuthLaunchLink = ({
  ariaLabel,
  buttonClassName,
  iconClassName,
}: GoogleOAuthLaunchLinkProps) => {
  const href = useSyncExternalStore(
    noopSubscribe,
    getGoogleOAuthStartUrl,
    getGoogleOAuthHrefServerSnapshot,
  )

  return (
    <a className={buttonClassName} href={href} aria-label={ariaLabel} rel="noopener noreferrer">
      <Icon aria-hidden className={iconClassName} height={36} name={"googleFilled"} width={36} />
    </a>
  )
}
