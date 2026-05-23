import clsx from "clsx"
import { ComponentPropsWithoutRef, ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import s from "./Button.module.css"
import { Loader } from "../Loader/Loader"

type ButtonVariant = "primary" | "secondary" | "outline" | "link" | "languageSwitcher"

type Props = {
  asChild?: boolean
  variant?: ButtonVariant
  children: ReactNode
  fullWidth?: boolean
  className?: string
  isLoading?: boolean
} & ComponentPropsWithoutRef<"button">

export const Button = ({
  asChild,
  variant = "primary",
  children,
  className,
  fullWidth,
  isLoading,
  ...rest
}: Props) => {
  const Component = asChild ? Slot : "button"
  const classNames = clsx(s.button, "h3", s[variant], { [s.fullWidth]: fullWidth }, className)

  return (
    <Component className={classNames} {...rest}>
      {isLoading ? (
        <span className={s.loader}>
          <Loader />
        </span>
      ) : (
        children
      )}
    </Component>
  )
}
