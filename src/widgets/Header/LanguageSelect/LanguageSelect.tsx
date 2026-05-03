"use client"

import { CustomSelect } from "@/common/components/CustomSelect/CustomSelect"
import { SelectOption } from "@/common/components/CustomSelect/customSelect.types"
import { useState } from "react"
import styles from "./LanguageSelect.module.css"

export const LanguageSelect = () => {
  const languageOptions: SelectOption[] = [
    { icon: "flagRussiaFilled", label: "Russian", value: "ru" },
    { icon: "flagUnitedKingdomFilled", label: "English", value: "en" },
  ]

  const [language, setLanguage] = useState("ru")

  return (
    <div className={styles.languageSelect}>
      <CustomSelect
        options={languageOptions}
        value={language}
        onValueChange={setLanguage}
        placeholder="language"
        className={styles.mobile}
        triggerClassName={styles.mobileTrigger}
      />
    </div>
  )
}
