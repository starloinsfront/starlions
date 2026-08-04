import { ComponentPropsWithoutRef, useId } from "react"
import s from "./TextArea.module.css"

export type Props = {
  label?: string
  errorMessage?: string
  containerClassName?: string
} & ComponentPropsWithoutRef<"textarea">

export const TextArea = ({
  label,
  errorMessage,
  className,
  containerClassName,
  id,
  ...rest
}: Props) => {
  const generatedId = useId()
  const finalId = id || generatedId

  const containerClasses = `${s.textareaContainer} ${errorMessage ? s.error : ""} ${containerClassName || ""}`
  const textareaClasses = `${s.textarea} ${className || ""}`

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={finalId} className={s.label}>
          {label}
        </label>
      )}

      <textarea id={finalId} className={textareaClasses} {...rest} />

      {errorMessage && <span className={s.errorText}>{errorMessage}</span>}
    </div>
  )
}
