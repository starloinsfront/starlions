import clsx from "clsx"
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

  return (
    <div className={clsx(s.inputContainer, { [s.error]: errorMessage }, containerClassName)}>
      {label && (
        <label htmlFor={finalId} className={clsx(s.label, "regularText14")}>
          {label}
        </label>
      )}

      <div className={s.inputWrapper}>
        {iconStart && <span className={s.iconStart}>{iconStart}</span>}

        <input
          id={finalId}
          type={inputType}
          className={clsx(
            s.input,
            "regularText16",
            {
              [s.withIconStart]: iconStart,
              [s.withIconEnd]: iconEnd || isPassword,
            },
            className,
          )}
          {...rest}
        />

        {isPassword ? (
          <button
            type="button"
            className={s.iconEnd}
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "eyeOffOutline" : "eyeOutline"} />
          </button>
        ) : (
          iconEnd && <span className={s.iconEnd}>{iconEnd}</span>
        )}
      </div>

      {errorMessage && <span className={clsx(s.errorText, "regularText14")}>{errorMessage}</span>}
    </div>
  )
}
