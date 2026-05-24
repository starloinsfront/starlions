export const ROUTES = {
  home: "/",

  feed: "/feed",
  create: "/create",
  profile: "/profile",
  messenger: "/messenger",
  search: "/search",
  statistics: "/statistics",
  favorites: "/favorites",

  signIn: "/login",
  signUp: "/signup",
  /** OAuth redirect: must match an Authorized redirect URI in Google Cloud (same origin as the app). */
  googleOAuthCallback: "/auth/google/callback",
  /**
   * After Google OAuth the API should redirect the browser **here** (app origin), not to `/api/v1/auth` on gateway.
   * Query: `accessToken` | `access_token` | `token` — JWT; prefer HttpOnly cookies + redirect without token in URL (backend).
   */
  oauthComplete: "/auth/oauth-complete",
  confirmEmail: "/auth/confirm-email",
  forgotPassword: "/forgot-password",
  emailCheck: "/forgot-password/email-check",
  createNewPassword: "/auth/create-new-password",
  recoveryLinkExpired: "/auth/recovery-link-expired",
  settings: "/settings",
  privacyPolicy: "/privacypolicy",
  termsOfService: "/termsofservice",
} as const
