import clsx from "clsx"
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react"

import { Icon } from "@/common/components/Icon/Icon"

import s from "./IconButton.module.css"
import { IconName } from "@/common/components/Icon/IconNameType"

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  activeIconName?: IconName
  children?: ReactNode
  color?: string
  iconName: IconName
  isActive?: boolean
}

/**
 * `IconButton` hides icon state logic behind props.
 * If `isActive` is true and `activeIconName` exists, both icon shape and color can change.
 * If `isActive` is true and `activeIconName` is omitted, only icon color changes.
 */
export const IconButton = ({
  activeIconName,
  children,
  className,
  color,
  iconName,
  isActive = false,
  type = "button",
  ...props
}: Props) => {
  const buttonClassName = clsx(s.iconButton, { [s.active]: isActive }, className)
  const resolvedIconName = isActive && activeIconName ? activeIconName : iconName
  const activeColor = color ?? "var(--accent-500)"
  const buttonStyle = {
    "--icon-button-active-color": activeColor,
  } as CSSProperties

  return (
    <button className={buttonClassName} style={buttonStyle} type={type} {...props}>
      <Icon className={s.icon} name={resolvedIconName} />
      {children}
    </button>
  )
}
