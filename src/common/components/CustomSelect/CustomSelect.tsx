"use client"

import * as Select from "@radix-ui/react-select"
import clsx from "clsx"
import { ComponentRef, forwardRef, useId } from "react"

import { Icon } from "../Icon/Icon"
import styles from "./CustomSelect.module.css"
import type { CustomSelectProps } from "./customSelect.types"

type SelectTriggerRef = ComponentRef<typeof Select.Trigger>

export const CustomSelect = forwardRef<SelectTriggerRef, CustomSelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      onBlur,
      placeholder = "Select",
      disabled = false,
      label,
      ariaLabel,
      error,
      name,
      id,
      required = false,
      className,
      triggerClassName,
      valueClassName,
      chevronClassName,
      contentClassName,
      optionClassName,
      optionContentClassName,
      optionIconClassName,
      optionLabelClassName,
    },
    ref,
  ) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const errorId = error ? `${selectId}-error` : undefined

    return (
      <div className={clsx(styles.wrapper, className)}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}

        <Select.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          name={name}
          disabled={disabled}
          required={required}
        >
          <Select.Trigger
            ref={ref}
            id={selectId}
            onBlur={onBlur}
            className={clsx(styles.trigger, error && styles.error, triggerClassName)}
            aria-label={label ? undefined : ariaLabel}
            aria-invalid={!!error}
            aria-describedby={errorId}
            aria-required={required}
          >
            <Select.Value className={clsx(styles.value, valueClassName)} placeholder={placeholder} />
            <Select.Icon className={clsx(styles.icon, chevronClassName)}>
              <Icon name="arrowIosDownOutline" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className={clsx(styles.content, contentClassName)}
              position="popper"
              side="bottom"
              align="start"
              sideOffset={-1}
            >
              <Select.Viewport className={styles.viewport}>
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    textValue={option.label}
                    className={clsx(styles.item, optionClassName)}
                  >
                    <Select.ItemText>
                      <span className={clsx(styles.itemContent, optionContentClassName)}>
                        {option.icon && (
                          <span className={clsx(styles.optionIcon, optionIconClassName)}>
                            <Icon name={option.icon} width={20} height={20} />
                          </span>
                        )}
                        <span className={clsx(styles.optionLabel, optionLabelClassName)}>
                          {option.label}
                        </span>
                      </span>
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {error && (
          <span id={errorId} className={styles.errorText}>
            {error}
          </span>
        )}
      </div>
    )
  },
)

CustomSelect.displayName = "CustomSelect"
