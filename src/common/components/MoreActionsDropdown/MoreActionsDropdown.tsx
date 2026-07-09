"use client"

import { ReactNode } from "react"
import { DropdownMenu } from "../DropdownMenu/DropdownMenu"
import { Icon } from "../Icon/Icon"
import styles from "./MoreActionsDropdown.module.css"
import clsx from "clsx"

type Props = {
  children: ReactNode
  classname?: string
}

export const MoreActionsDropdown = ({ children, classname }: Props) => {
  return (
    <DropdownMenu
      align="end"
      modal
      contentClassName={clsx(styles.dropdownContent, classname)}
      trigger={
        <button className={styles.trigger} aria-label="Menu" type="button">
          <Icon name="moreHorizontalOutline" width={24} height={24} />
        </button>
      }
    >
      {children}
    </DropdownMenu>
  )
}
