"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Icon } from "@/common/components/Icon/Icon"
import { GeneralInformationForm } from "../GeneralInformationForm"
import s from "./SettingsView.module.css"

const TABS = ["General information", "Devices", "Account Management", "My payments"] as const
type Tab = (typeof TABS)[number]

export const SettingsView = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("General information")

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
        {TABS.map((tab) => (
          <button
            aria-controls="settings-tab-panel"
            aria-selected={activeTab === tab}
            key={tab}
            type="button"
            className={`${s.tab} ${activeTab === tab ? s.tabActive : ""}`}
            onClick={() => setActiveTab(tab)}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className={s.content} id="settings-tab-panel" role="tabpanel">
        {activeTab === "General information" && <GeneralInformationForm />}
        {activeTab !== "General information" && <p className={s.placeholder}>Coming soon</p>}
      </div>
    </div>
  )
}
