"use client"

import { useState } from "react"

import { CustomSelect } from "@/common/components/CustomSelect/CustomSelect"
import { SelectOption } from "@/common/components/CustomSelect/customSelect.types"

import styles from "./LanguageSelect.module.css"

type Language = "ru" | "en"

const LANGUAGE_OPTIONS: SelectOption[] = [
  { icon: "flagRussiaFilled", label: "Russian", value: "ru" },
  { icon: "flagUnitedKingdomFilled", label: "English", value: "en" },
]

export const LanguageSelect = () => {
  const [language, setLanguage] = useState<Language>("ru")

  return (
    <div className={styles.languageSelect}>
      <CustomSelect
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
