import { ComponentPropsWithoutRef, useId } from "react"
import s from "./TextArea.module.css"

export type Props = {
  label?: string
  errorMessage?: string
  containerClassName?: string
  showCharacterCount?: boolean
} & ComponentPropsWithoutRef<"textarea">

export const TextArea = ({
  label,
  errorMessage,
  className,
  containerClassName,
  showCharacterCount = false,
  id,
  maxLength,
  value,
  ...rest
}: Props) => {
  const generatedId = useId()
  const finalId = id || generatedId

  const containerClasses = `${s.textareaContainer} ${errorMessage ? s.error : ""} ${containerClassName || ""}`
  const textareaClasses = `${s.textarea} ${className || ""}`
  const shouldShowCharacterCount = showCharacterCount && typeof maxLength === "number"
  const characterCount = typeof value === "string" ? value.length : 0

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={finalId} className={s.label}>
          {label}
        </label>
      )}

      <textarea
        id={finalId}
        className={textareaClasses}
        maxLength={maxLength}
        value={value}
        {...rest}
      />

      {(errorMessage || shouldShowCharacterCount) && (
        <div className={s.meta}>
          {errorMessage && <span className={s.errorText}>{errorMessage}</span>}
          {shouldShowCharacterCount && (
            <span aria-hidden="true" className={s.characterCount}>
              {characterCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
