"use client"

import { forwardRef } from "react"
import type { CustomSelectProps } from "./customSelect.types"
import { CompoundSelect } from "../CompoundSelect"
import { Icon } from "../Icon/Icon"

export const Select = forwardRef<HTMLButtonElement, CustomSelectProps>(
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
    return (
      <CompoundSelect.Root
        id={id}
        className={className}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
        required={required}
        error={error}
      >
        {label && <CompoundSelect.Label>{label}</CompoundSelect.Label>}
        <CompoundSelect.Trigger
          ref={ref}
          onBlur={onBlur}
          className={triggerClassName}
          aria-label={label ? undefined : ariaLabel}
          aria-required={required}
        >
          <CompoundSelect.Value className={valueClassName} placeholder={placeholder} />
          <CompoundSelect.Icon className={chevronClassName} />
        </CompoundSelect.Trigger>
        <CompoundSelect.Content className={contentClassName}>
          {options.map((option) => (
            <CompoundSelect.Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              textValue={option.label}
              icon={option.icon ? <Icon name={option.icon} width={20} height={20} /> : undefined}
              className={optionClassName}
              contentClassName={optionContentClassName}
              iconClassName={optionIconClassName}
              labelClassName={optionLabelClassName}
            >
              {option.label}
            </CompoundSelect.Option>
          ))}
        </CompoundSelect.Content>
        <CompoundSelect.ErrorMessage />
      </CompoundSelect.Root>
    )
  },
)

Select.displayName = "Select"
