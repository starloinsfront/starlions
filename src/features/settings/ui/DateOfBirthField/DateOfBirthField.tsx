"use client"

import { forwardRef } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./DateOfBirthField.module.css"

type Props = {
  value: string | null | undefined
  onChange: (isoDate: string | null) => void
  error?: string
}

const toDate = (iso: string | null | undefined): Date | null => {
  if (!iso) return null
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

const toIso = (d: Date | null): string | null => {
  if (!d) return null
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

type CustomInputProps = {
  value?: string
  onClick?: () => void
  error?: string
}

const CustomInput = forwardRef<HTMLDivElement, CustomInputProps>(
  ({ value, onClick, error }, ref) => (
    <div className={s.fieldWrapper}>
      <label className={s.label}>Date of Birth</label>
      <div
        className={`${s.input} ${error ? s.inputError : ""}`}
        onClick={onClick}
        ref={ref}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick?.()
        }}
      >
        <span className={value ? s.valueText : s.placeholderText}>
          {value || "dd.mm.yyyy"}
        </span>
        <Icon name="calendarOutline" width={20} height={20} className={s.calendarIcon} />
      </div>
      {error && <span className={s.errorText}>{error}</span>}
    </div>
  ),
)
CustomInput.displayName = "CustomInput"

export const DateOfBirthField = ({ value, onChange, error }: Props) => {
  const selectedDate = toDate(value)

  return (
    <div className={s.container}>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => onChange(toIso(date))}
        dateFormat="dd.MM.yyyy"
        customInput={<CustomInput error={error} />}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        maxDate={new Date()}
        minDate={new Date(1900, 0, 1)}
        placeholderText="dd.mm.yyyy"
        calendarClassName={s.calendar}
        dayClassName={() => s.day}
        weekDayClassName={() => s.weekDay}
        popperClassName={s.popper}
      />
    </div>
  )
}
