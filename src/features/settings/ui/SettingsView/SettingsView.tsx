"use client"

import { useState } from "react"
import { GeneralInformationForm } from "../GeneralInformationForm"
import s from "./SettingsView.module.css"

const TABS = ["General Information", "Devices", "Account Management"] as const
type Tab = (typeof TABS)[number]

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<Tab>("General Information")

  return (
    <div className={s.container}>
      <h1 className={s.title}>General Information</h1>
      <nav className={s.tabs} aria-label="Settings sections">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${s.tab} ${activeTab === tab ? s.tabActive : ""}`}
            onClick={() => setActiveTab(tab)}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className={s.content} role="tabpanel">
        {activeTab === "General Information" && <GeneralInformationForm />}
        {activeTab !== "General Information" && (
          <p className={s.placeholder}>Coming soon</p>
        )}
      </div>
    </div>
  )
}
