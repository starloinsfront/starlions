"use client"

import { useState } from "react"

import { SelectOption } from "@/common/components/Select/customSelect.types"

import styles from "./LanguageSelect.module.css"
import { Select } from "@/common/components/Select/CustomSelect"

type Language = "ru" | "en"

const LANGUAGE_OPTIONS: SelectOption[] = [
  { icon: "flagRussiaFilled", label: "Russian", value: "ru" },
  { icon: "flagUnitedKingdomFilled", label: "English", value: "en" },
]

export const LanguageSelect = () => {
  const [language, setLanguage] = useState<Language>("ru")

  return (
    <div className={styles.languageSelect}>
      <Select
        options={LANGUAGE_OPTIONS}
        value={language}
        onValueChange={(value) => setLanguage(value as Language)}
        placeholder="language"
        ariaLabel="Language"
        triggerClassName={styles.mobileTrigger}
        chevronClassName={styles.chevron}
        optionLabelClassName={styles.optionLabel}
      />
    </div>
  )
}
