"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./LocationSelect.module.css"

type Item<T extends string | number> = {
  id: T
  name: string
}

type Props<T extends string | number> = {
  label: string
  placeholder: string
  items: Item<T>[]
  value: T | null | undefined
  onChange: (value: T | null) => void
  disabled?: boolean
  error?: string
  allowFreeText?: boolean
  isLoading?: boolean
  onSearchChange?: (query: string) => void
}

export const LocationSelect = <T extends string | number>({
  label,
  placeholder,
  items,
  value,
  onChange,
  disabled = false,
  error,
  allowFreeText = false,
  isLoading = false,
  onSearchChange,
}: Props<T>) => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = useId()
  const listboxId = useId()

  const selectedItem = items.find((item) => item.id === value)
  const isFreeText = allowFreeText && value && !selectedItem

  const filteredItems = useMemo(() => {
    const searchQuery = isOpen ? query : selectedItem ? "" : String(value ?? "")
    if (!searchQuery.trim()) return items
    const lowerQuery = searchQuery.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(lowerQuery))
  }, [items, query, isOpen, value, selectedItem])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      onSearchChange?.(e.target.value)
      setIsOpen(true)
      if (selectedItem && e.target.value !== selectedItem.name) {
        onChange(null)
      }
    },
    [onChange, onSearchChange, selectedItem],
  )

  const handleSelect = useCallback(
    (item: Item<T>) => {
      setQuery("")
      onSearchChange?.("")
      setIsOpen(false)
      onChange(item.id)
    },
    [onChange, onSearchChange],
  )

  const handleFocus = useCallback(() => {
    setIsOpen(true)
    if (selectedItem) {
      setQuery(selectedItem.name)
      onSearchChange?.(selectedItem.name)
    }
  }, [onSearchChange, selectedItem])

  const handleBlur = useCallback(() => {
    if (selectedItem) {
      setQuery("")
      onSearchChange?.("")
    } else if (allowFreeText && query.trim()) {
      onChange(query.trim() as T)
      setQuery("")
      onSearchChange?.("")
    } else if (!allowFreeText) {
      onChange(null)
      setQuery("")
      onSearchChange?.("")
    }
    setIsOpen(false)
  }, [allowFreeText, onChange, onSearchChange, query, selectedItem])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (selectedItem) {
          setQuery("")
          onSearchChange?.("")
        } else if (allowFreeText && query.trim()) {
          onChange(query.trim() as T)
          setQuery("")
          onSearchChange?.("")
        } else if (!allowFreeText) {
          onChange(null)
          setQuery("")
          onSearchChange?.("")
        }
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [allowFreeText, onChange, onSearchChange, query, selectedItem])

  const displayValue = isOpen
    ? query
    : selectedItem
      ? selectedItem.name
      : isFreeText
        ? String(value)
        : ""

  return (
    <div className={s.fieldGroup}>
      <label className={s.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={s.wrapper} ref={containerRef}>
        <input
          className={`${s.input} ${error ? s.inputError : ""}`}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          id={inputId}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
        />
        <Icon
          name="arrowIosDownOutline"
          width={20}
          height={20}
          className={`${s.chevronIcon} ${isOpen ? s.chevronOpen : ""}`}
        />

        {isOpen && (isLoading || filteredItems.length > 0) && (
          <ul className={s.dropdown} id={listboxId} role="listbox">
            {isLoading ? (
              <li className={s.loadingOption} role="status">
                Loading…
              </li>
            ) : (
              filteredItems.map((item) => (
                <li key={String(item.id)}>
                  <button
                    type="button"
                    className={s.option}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelect(item)
                    }}
                    role="option"
                    aria-selected={item.id === value}
                  >
                    {item.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && <span className={s.errorText}>{error}</span>}
    </div>
  )
}
