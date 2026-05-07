import { ReactNode } from "react"
import { Dropdown } from "../Dropdown/Dropdown"
import { Icon } from "../Icon/Icon"
import styles from "./DropdownMenu.module.css"

type Props = {
  children: ReactNode
}

export const DropdownMenu = ({ children }: Props) => {
  return (
    <Dropdown
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
    </Dropdown>
  )
}
