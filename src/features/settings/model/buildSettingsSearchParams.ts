import {
  SETTINGS_ACCOUNT_TYPE_QUERY_KEY,
  SETTINGS_TAB_QUERY_KEY,
  type SettingsAccountType,
  type SettingsTab,
  settingsTabToSlug,
} from "./settingsSearchParams"

type BuildSettingsSearchParamsInput = {
  current: URLSearchParams
  tab: SettingsTab
  accountType?: SettingsAccountType
}

export const buildSettingsSearchParams = ({
  current,
  tab,
  accountType,
}: BuildSettingsSearchParamsInput): URLSearchParams => {
  const next = new URLSearchParams(current.toString())

  next.set(SETTINGS_TAB_QUERY_KEY, settingsTabToSlug(tab))

  if (tab === "Account Management") {
    next.set(SETTINGS_ACCOUNT_TYPE_QUERY_KEY, accountType ?? "personal")
  } else {
    next.delete(SETTINGS_ACCOUNT_TYPE_QUERY_KEY)
  }

  return next
}
