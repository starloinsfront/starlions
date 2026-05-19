import { Icon } from "@/common/components/Icon/Icon"
import styles from "../../../../widgets/Sidebar/NavLink/NavLink.module.css"
import clsx from "clsx"

"use client"

import { ROUTES } from "@/common/constants/route"
import { clearAccessToken } from "@/common/utils/auth/accessToken"
import { useRouter } from "next/navigation"

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
