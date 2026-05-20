import { Icon } from "@/common/components/Icon/Icon"
import styles from "../../../../widgets/Sidebar/NavLink/NavLink.module.css"
import clsx from "clsx"


type Props = {
  onClick?: () => void
}

export const Logout = ({ onClick }: Props) => {
  return (
    <div onClick={onClick} className={clsx(styles.navLink, "mediumText14")}>
      <Icon name="logOutOutline" />
      Log Out
    </div>
  )
}
