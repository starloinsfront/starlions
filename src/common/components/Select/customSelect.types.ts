import { IconName } from "../Icon/IconNameType"

import type { FocusEventHandler } from "react"

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
  icon?: IconName
}

export type CustomSelectProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onBlur?: FocusEventHandler<HTMLButtonElement>
  placeholder?: string
  disabled?: boolean
  label?: string
  ariaLabel?: string
  error?: string
  name?: string
  id?: string
  required?: boolean
  className?: string
  triggerClassName?: string
  valueClassName?: string
  chevronClassName?: string
  contentClassName?: string
  optionClassName?: string
  optionContentClassName?: string
  optionIconClassName?: string
  optionLabelClassName?: string
}
