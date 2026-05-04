import { Logout } from "@/features/auth/ui/Logout/Logout"
import { Icon } from "@/common/components/Icon/Icon"
import { NavLink } from "./NavLink/NavLink"
import { sidebarSections } from "./sidebar.data"
import styles from "./Sidebar.module.css"
import clsx from "clsx"

export const Sidebar = () => {
  const { main, secondary } = sidebarSections

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarSection}>
        <ul>
          {main?.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>
                <Icon name={link.icon} />
                <span className={styles.textLink}>{link.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <nav className={clsx(styles.sidebarSection, styles.mobileNav)}>
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
      <div className={clsx(styles.logoutSection, styles.mobileNav)}>
        <Logout />
      </div>
    </aside>
  )
}
