"use client"

import { useState } from "react"
import { CustomSelect } from "../../CustomSelect/CustomSelect"
import { SelectOption } from "../../CustomSelect/customSelect.types"
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
      />
    </div>
  )
}
