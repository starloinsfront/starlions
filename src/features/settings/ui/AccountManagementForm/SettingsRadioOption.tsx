"use client"

import { Icon } from "@/common/components/Icon/Icon"

import s from "./AccountManagementForm.module.css"

type Props = {
  checked: boolean
  label: string
  name: string
  onChange: () => void
  value: string
}

export const SettingsRadioOption = ({ checked, label, name, onChange, value }: Props) => {
  return (
    <label className={s.radioOption}>
      <input
        checked={checked}
        className={s.radioInput}
        name={name}
        onChange={onChange}
        type="radio"
        value={value}
      />
      <Icon
        className={s.radioIcon}
        height={24}
        name={checked ? "radioButtonCheckedFilled" : "radioButtonUncheckedOutline"}
        width={24}
      />
      <span className={s.radioLabel}>{label}</span>
    </label>
  )
}
