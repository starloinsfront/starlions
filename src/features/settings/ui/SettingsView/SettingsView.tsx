"use client"

import { Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Icon } from "@/common/components/Icon/Icon"
import { buildSettingsSearchParams } from "../../model/buildSettingsSearchParams"
import {
  parseSettingsAccountType,
  parseSettingsTab,
  SETTINGS_ACCOUNT_TYPE_QUERY_KEY,
  SETTINGS_TAB_QUERY_KEY,
  SETTINGS_TABS,
  type SettingsTab,
} from "../../model/settingsSearchParams"
import { AccountManagementForm } from "../AccountManagementForm"
import { GeneralInformationForm } from "../GeneralInformationForm"
import s from "./SettingsView.module.css"

const SettingsViewContent = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab = parseSettingsTab(searchParams.get(SETTINGS_TAB_QUERY_KEY))

  const replaceSettingsUrl = (tab: SettingsTab) => {
    const accountType = parseSettingsAccountType(searchParams.get(SETTINGS_ACCOUNT_TYPE_QUERY_KEY))
    const next = buildSettingsSearchParams({
      accountType,
      current: searchParams,
      tab,
    })
    const query = next.toString()

    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className={s.container}>
      <div className={s.mobileHeading}>
        <button
          aria-label="Go back"
          className={s.backButton}
          onClick={() => router.back()}
          type="button"
        >
          <Icon height={24} name="arrowBackOutline" width={24} />
        </button>
        <h1 className={s.title}>Profile Settings</h1>
      </div>

      <nav className={s.tabs} aria-label="Settings sections" role="tablist">
        {SETTINGS_TABS.map((tab) => (
          <button
            aria-controls="settings-tab-panel"
            aria-selected={activeTab === tab}
            key={tab}
            type="button"
            className={`${s.tab} ${activeTab === tab ? s.tabActive : ""}`}
            onClick={() => replaceSettingsUrl(tab)}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className={s.content} id="settings-tab-panel" role="tabpanel">
        {activeTab === "General information" && <GeneralInformationForm />}
        {activeTab === "Account Management" && <AccountManagementForm />}
        {activeTab !== "General information" && activeTab !== "Account Management" && (
          <p className={s.placeholder}>Coming soon</p>
        )}
      </div>
    </div>
  )
}

const SettingsViewFallback = () => {
  return (
    <div className={s.container}>
      <h1 className={s.title}>Profile Settings</h1>
    </div>
  )
}

export const SettingsView = () => {
  return (
    <Suspense fallback={<SettingsViewFallback />}>
      <SettingsViewContent />
    </Suspense>
  )
}
