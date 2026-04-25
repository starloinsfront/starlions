"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps } from "react"
import styles from "./NavLink.module.css"

type Props = ComponentProps<typeof Link> & {
  href: string
  disabled?: boolean
  exact?: boolean
}

export const NavLink = ({
  href,
  disabled = false,
  exact = false,
  children,
  className,
  ...linkProps
}: Props) => {
  const pathname = usePathname()

  const isActive = exact
    ? pathname === href
    : href === "/"
      ? pathname === "/"
      : pathname.startsWith(href)

  const linkClassName = clsx(
    styles.navLink,
    "mediumText14",
    isActive && styles.active,
    disabled && styles.disabled,
    className,
  )

  if (disabled) {
    return (
      <span className={linkClassName} aria-disabled="true">
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className={linkClassName}
      aria-current={isActive ? "page" : undefined}
      {...linkProps}
    >
      {children}
    </Link>
  )
}
