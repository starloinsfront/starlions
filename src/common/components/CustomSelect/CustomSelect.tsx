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
      error,
      name,
      id,
      required = false,
      className,
    },
    ref,
  ) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const errorId = error ? `${selectId}-error` : undefined

    return (
      <div className={styles.wrapper}>
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
            className={clsx(styles.trigger, error && styles.error, className)}
            aria-invalid={!!error}
            aria-describedby={errorId}
          >
            <Select.Value className={styles.value} placeholder={placeholder} />
            <Select.Icon className={styles.icon}>
              <Icon name="arrowIosDownOutline" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className={styles.content}
              position="popper"
              side="bottom"
              align="start"
              sideOffset={-1}
            >
              <Select.ScrollUpButton className={styles.scrollButton}>
                <Icon name="arrowIosDownOutline" />
              </Select.ScrollUpButton>

              <Select.Viewport className={styles.viewport}>
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={styles.item}
                  >
                    <Select.ItemText>
                      <span className={styles.itemContent}>
                        {option.icon && <Icon name={option.icon} width={20} height={20} />}
                        <span>{option.label}</span>
                      </span>
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>

              <Select.ScrollDownButton className={styles.scrollButton}>
                <Icon name="arrowIosDownOutline" />
              </Select.ScrollDownButton>
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
