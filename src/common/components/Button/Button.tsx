import clsx from "clsx"
import { ComponentPropsWithoutRef, ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import s from "./Button.module.css"

type ButtonVariant = "primary" | "secondary" | "outline" | "link" | "languageSwitcher"

type Props = {
  asChild?: boolean
  variant?: ButtonVariant
  children: ReactNode
  fullWidth?: boolean
  className?: string
} & ComponentPropsWithoutRef<"button">

export const Button = ({
  asChild,
  variant = "primary",
  children,
  className,
  fullWidth,
  ...rest
}: Props) => {
  const Component = asChild ? Slot : "button"
  const classNames = clsx(s.button, "h3", s[variant], { [s.fullWidth]: fullWidth }, className)

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  )
}
