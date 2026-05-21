"use client"

import { ReactNode } from "react"
import { DropdownMenu } from "../DropdownMenu/DropdownMenu"
import { Icon } from "../Icon/Icon"
import styles from "./MoreActionsDropdown.module.css"

type Props = {
  children: ReactNode
}

export const MoreActionsDropdown = ({ children }: Props) => {
  return (
    <DropdownMenu
      align="end"
      modal
      contentClassName={styles.dropdownContent}
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
