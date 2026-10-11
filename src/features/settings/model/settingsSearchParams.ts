export const SETTINGS_TAB_QUERY_KEY = "tab"
export const SETTINGS_ACCOUNT_TYPE_QUERY_KEY = "accountType"

export const SETTINGS_TAB_SLUGS = {
  general: "general",
  devices: "devices",
  accountManagement: "account-management",
  myPayments: "my-payments",
} as const

export type SettingsTabSlug = (typeof SETTINGS_TAB_SLUGS)[keyof typeof SETTINGS_TAB_SLUGS]

export const SETTINGS_TABS = [
  "General information",
  "Devices",
  "Account Management",
  "My payments",
] as const

export type SettingsTab = (typeof SETTINGS_TABS)[number]

const TAB_BY_SLUG: Record<SettingsTabSlug, SettingsTab> = {
  [SETTINGS_TAB_SLUGS.general]: "General information",
  [SETTINGS_TAB_SLUGS.devices]: "Devices",
  [SETTINGS_TAB_SLUGS.accountManagement]: "Account Management",
  [SETTINGS_TAB_SLUGS.myPayments]: "My payments",
}

const SLUG_BY_TAB: Record<SettingsTab, SettingsTabSlug> = {
  "General information": SETTINGS_TAB_SLUGS.general,
  Devices: SETTINGS_TAB_SLUGS.devices,
  "Account Management": SETTINGS_TAB_SLUGS.accountManagement,
  "My payments": SETTINGS_TAB_SLUGS.myPayments,
}

export const SETTINGS_ACCOUNT_TYPES = ["personal", "business"] as const

export type SettingsAccountType = (typeof SETTINGS_ACCOUNT_TYPES)[number]

export const settingsTabToSlug = (tab: SettingsTab): SettingsTabSlug => SLUG_BY_TAB[tab]

export const parseSettingsTab = (value: string | null | undefined): SettingsTab => {
  if (!value) {
    return "General information"
  }

  return TAB_BY_SLUG[value as SettingsTabSlug] ?? "General information"
}

export const parseSettingsAccountType = (
  value: string | null | undefined,
): SettingsAccountType => {
  if (value === "personal" || value === "business") {
    return value
  }

  return "personal"
}
