"use client"

import clsx from "clsx"

import { Logout } from "@/features/auth/ui/Logout/Logout"
import { Icon } from "@/common/components/Icon/Icon"

import { NavLink } from "./NavLink/NavLink"
import { sidebarSections } from "./sidebar.data"
import styles from "./Sidebar.module.css"


export const Sidebar = () => {
  const { main, secondary } = sidebarSections


  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarSection} aria-label="Main navigation">
        <ul className={styles.navList}>
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

      <nav
        className={clsx(styles.sidebarSection, styles.desktopOnly)}
        aria-label="Secondary navigation"
      >
        <ul className={styles.navList}>
          {secondary?.slice(1).map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>
                <Icon name={link.icon} />
                <span>{link.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={clsx(styles.logoutSection, styles.desktopOnly)}>
        <Logout />
      </div>

    </aside>
  )
}
