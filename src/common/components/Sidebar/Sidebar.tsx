import { Icon } from "../Icon/Icon"
import { IconButton } from "../IconButton/IconButton"
import { NavLink } from "./NavLink/NavLink"
import { sidebarSections } from "./sidebar.data"
import styles from "./Sidebar.module.css"

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
        <IconButton iconName="logOutOutline">Logout</IconButton>
      </div>
    </aside>
  )
}
