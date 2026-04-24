import clsx from "clsx"
import { ComponentPropsWithoutRef, ReactNode } from "react"
import s from "./Button.module.css"
import { Slot } from "@radix-ui/react-slot"

type ButtonVariant = "primary" | "secondary" | "outline" | "link"

type Props = {
  asChild?: boolean
  variant?: ButtonVariant
  children: ReactNode
  fullWidth?: boolean
} & ComponentPropsWithoutRef<"button">

export const Button = ({
  asChild,
  variant = "primary",
  children,
  className,
  fullWidth,
  ...rest
}: Props) => {
  const classNames = clsx(s.button, s[variant], { [s.fullWidth]: fullWidth }, className)
  const Component = asChild ? Slot : "button"

  return (
    <Component className={classNames} {...rest}>
      {children}
    </Component>
  )
}
