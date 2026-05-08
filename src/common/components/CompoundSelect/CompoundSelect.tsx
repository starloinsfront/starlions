"use client"

import * as RadixSelect from "@radix-ui/react-select"
import clsx from "clsx"
import { createContext, forwardRef, useContext, useId } from "react"
import styles from "./CompoundSelect.module.css"
import type {
  CompoundSelectRootProps,
  CompoundSelectLabelProps,
  CompoundSelectTriggerProps,
  CompoundSelectValueProps,
  CompoundSelectIconProps,
  CompoundSelectContentProps,
  CompoundSelectOptionProps,
  CompoundSelectErrorMessageProps,
} from "./compoundSelect.types"
import { Icon as AppIcon } from "../Icon/Icon"

interface CompoundSelectContextProps {
  errorId?: string
  error?: string | null
  selectId: string
}

const CompoundSelectContext = createContext<CompoundSelectContextProps | undefined>(undefined)

export const Root = ({
  children,
  error,
  name,
  required,
  disabled,
  id,
  className,
  ...props
}: CompoundSelectRootProps) => {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <div className={clsx(styles.wrapper, className)}>
      <CompoundSelectContext.Provider value={{ errorId, error, selectId }}>
        <RadixSelect.Root name={name} required={required} disabled={disabled} {...props}>
          {children}
        </RadixSelect.Root>
      </CompoundSelectContext.Provider>
    </div>
  )
}

export const Label = ({ children, htmlFor, className }: CompoundSelectLabelProps) => {
  const ctx = useContext(CompoundSelectContext)
  return (
    <label htmlFor={htmlFor ?? ctx?.selectId} className={clsx(styles.label, className)}>
      {children}
    </label>
  )
}

export const Trigger = forwardRef<HTMLButtonElement, CompoundSelectTriggerProps>(
  (
    {
      children,
      id,
      className,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const ctx = useContext(CompoundSelectContext)
    const describedBy = [ariaDescribedBy, ctx?.errorId].filter(Boolean).join(" ") || undefined

    return (
      <RadixSelect.Trigger
        ref={ref}
        id={id ?? ctx?.selectId}
        className={clsx(styles.trigger, ctx?.error && styles.error, className)}
        aria-invalid={ariaInvalid ?? !!ctx?.error}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </RadixSelect.Trigger>
    )
  },
)
Trigger.displayName = "CompoundSelect.Trigger"

export const Value = ({ placeholder, className }: CompoundSelectValueProps) => (
  <RadixSelect.Value className={clsx(styles.value, className)} placeholder={placeholder} />
)

export const Icon = ({ className }: CompoundSelectIconProps) => (
  <RadixSelect.Icon className={clsx(styles.icon, className)}>
    <AppIcon name="arrowIosDownOutline" />
  </RadixSelect.Icon>
)

export const Content = ({ children, className, ...props }: CompoundSelectContentProps) => (
  <RadixSelect.Portal>
    <RadixSelect.Content
      className={clsx(styles.content, className)}
      position="popper"
      side="bottom"
      align="start"
      sideOffset={-1}
      {...props}
    >
      <RadixSelect.Viewport className={styles.viewport}>{children}</RadixSelect.Viewport>
    </RadixSelect.Content>
  </RadixSelect.Portal>
)

export const Option = ({
  value,
  disabled,
  textValue,
  icon,
  children,
  className,
  contentClassName,
  iconClassName,
  labelClassName,
  ...props
}: CompoundSelectOptionProps) => (
  <RadixSelect.Item
    value={value}
    disabled={disabled}
    textValue={textValue}
    className={clsx(styles.item, className)}
    {...props}
  >
    <RadixSelect.ItemText>
      <span className={clsx(styles.itemContent, contentClassName)}>
        {icon && <span className={clsx(styles.optionIcon, iconClassName)}>{icon}</span>}
        <span className={clsx(styles.optionLabel, labelClassName)}>{children}</span>
      </span>
    </RadixSelect.ItemText>
  </RadixSelect.Item>
)

export const ErrorMessage = ({ error, className }: CompoundSelectErrorMessageProps) => {
  const ctx = useContext(CompoundSelectContext)
  if (!error && !ctx?.error) return null
  return (
    <span id={ctx?.errorId} className={clsx(styles.errorText, className)}>
      {error ?? ctx?.error}
    </span>
  )
}

export const CompoundSelect = {
  Root,
  Label,
  Trigger,
  Value,
  Icon,
  Content,
  Option,
  ErrorMessage,
}
