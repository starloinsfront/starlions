"use client"

import clsx from "clsx"

import { Logout } from "@/features/auth/ui/Logout/Logout"
import { Icon } from "@/common/components/Icon/Icon"

import { NavLink } from "./NavLink/NavLink"
import { sidebarSections } from "./sidebar.data"
import styles from "./Sidebar.module.css"
import { useState } from "react"
import { Modal } from "@/common/components/Modal/Modal"
import { Button } from "@/common/components/Button/Button"
import { useLogoutMutation } from "@/features/auth/api/useLogoutMutation"

export const Sidebar = () => {
  const { main, secondary } = sidebarSections
  const [isModalOpen, setIsModalOpen] = useState(false)
  const mutation = useLogoutMutation()

  const handleLogout = () => {
    mutation.mutate()
    setIsModalOpen(false)
  }


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
        <Logout onClick={() => setIsModalOpen(true)} />
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle={"Log Out"}
        size={"sm"}
      >
        <p>Are you really want to log out of your account @email?</p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "24px",
            marginTop: "30px",
          }}
        >
          <Button
            onClick={handleLogout}
            variant={"outline"}
            style={{
              width: "96px",
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            style={{
              width: "96px",
            }}
          >
            No
          </Button>
        </div>
      </Modal>
    </aside>
  )
}
