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
  error?: string
  name?: string
  id?: string
  required?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
}
