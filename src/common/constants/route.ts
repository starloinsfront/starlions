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
  confirmEmail: "/auth/confirm-email",
  forgotPassword: "/forgot-password",
  emailCheck: "/forgot-password/email-check",
  createNewPassword: "/auth/create-new-password",
  recoveryLinkExpired: "/auth/recovery-link-expired",
  settings: "/settings",
  privacyPolicy: "/privacypolicy",
  termsOfService: "/termsofservice",
} as const
