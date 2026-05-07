import { ReactNode } from "react"
import {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
} from "@radix-ui/react-select"

export interface CompoundSelectRootProps extends Omit<SelectProps, "children"> {
  children: ReactNode
  error?: string | null
  name?: string
  required?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

export interface CompoundSelectLabelProps {
  children: ReactNode
  htmlFor?: string
  className?: string
}

export interface CompoundSelectTriggerProps extends SelectTriggerProps {
  children: ReactNode
  id?: string
  className?: string
  "aria-label"?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  "aria-required"?: boolean
}

export interface CompoundSelectValueProps {
  placeholder?: string
  className?: string
}

export interface CompoundSelectIconProps {
  className?: string
}

export interface CompoundSelectContentProps extends SelectContentProps {
  children: ReactNode
  className?: string
}

export interface CompoundSelectOptionProps extends SelectItemProps {
  value: string
  disabled?: boolean
  textValue?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  iconClassName?: string
  labelClassName?: string
}

export interface CompoundSelectErrorMessageProps {
  error?: string | null
  className?: string
}
