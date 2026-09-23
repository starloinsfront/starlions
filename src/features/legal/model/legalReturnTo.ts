const PROFILE_SETTINGS_PATH = /^\/profile\/[^/?#]+\/settings$/

export const getSafeSettingsReturnTo = (returnTo: string | null): string | null => {
  if (!returnTo || !PROFILE_SETTINGS_PATH.test(returnTo)) {
    return null
  }

  return returnTo
}
