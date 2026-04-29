"use client"

import { Logout } from "@/features/auth/ui/Logout/Logout"
import { Icon } from "@/common/components/Icon/Icon"
import { NavLink } from "./NavLink/NavLink"
import { sidebarSections } from "./sidebar.data"
import styles from "./Sidebar.module.css"
import { useLogout } from "@/features/auth/lib/useLogout"

export const Sidebar = () => {
  const { main, secondary } = sidebarSections
  const { logout } = useLogout()

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarSection}>
        <ul>
          {main?.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>
                <Icon name={link.icon} />
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <nav className={styles.sidebarSection}>
        <ul>
          {secondary?.map((link, index) => (
            <li key={index}>
              <NavLink href={link.href}>
                <Icon name={link.icon} />
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.logoutSection}>
        <Logout onClick={logout} />
      </div>
    </aside>
  )
}
