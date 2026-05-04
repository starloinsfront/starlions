import { ComponentPropsWithoutRef, ReactNode, useId, useState } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./TextField.module.css"

export type Props = {
  label?: string
  errorMessage?: string
  iconStart?: ReactNode
  iconEnd?: ReactNode
  containerClassName?: string
} & ComponentPropsWithoutRef<"input">

export const TextField = ({
  label,
  errorMessage,
  iconStart,
  iconEnd,
  className,
  containerClassName,
  type,
  id,
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const generatedId = useId()
  const finalId = id || generatedId

  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  const containerClasses = `${s.inputContainer} ${errorMessage ? s.error : ""} ${containerClassName || ""}`
  const inputClasses = `${s.input} ${iconStart ? s.withIconStart : ""} ${iconEnd || isPassword ? s.withIconEnd : ""} ${className || ""}`

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={finalId} className={s.label}>
          {label}
        </label>
      )}

      <div className={s.inputWrapper}>
        {iconStart && <span className={s.iconStart}>{iconStart}</span>}

        <input id={finalId} type={inputType} className={inputClasses} {...rest} />

        {isPassword ? (
          <button
            type="button"
            className={s.iconEnd}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon height={20} name={showPassword ? "eyeOffOutline" : "eyeOutline"} width={20} />
          </button>
        ) : (
          iconEnd && <span className={s.iconEnd}>{iconEnd}</span>
        )}
      </div>

      <span className={s.errorText}>{errorMessage || "\u00A0"}</span>
    </div>
  )
}
