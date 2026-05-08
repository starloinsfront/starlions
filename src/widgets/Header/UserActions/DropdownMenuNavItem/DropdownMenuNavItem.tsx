/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { DropdownMenuItem } from "@/common/components/Dropdown/Dropdown"
import { DropdownMenu } from "@/common/components/DropdownMenu/DropdownMenu"
import { Icon } from "@/common/components/Icon/Icon"
import { Logout } from "@/features/auth/ui/Logout/Logout"
import { NavLink } from "@/widgets/Sidebar/NavLink/NavLink"
import { sidebarSections } from "@/widgets/Sidebar/sidebar.data"
import styles from "./DropdownMenuNavItem.module.css"
import { useState, useEffect } from "react"

export const DropdownMenuNavItem = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={styles.mobileHeaderLink}>
      {mounted && (
        <DropdownMenu>
          {sidebarSections.secondary?.map((link) => (
            <DropdownMenuItem key={link.href} asChild unstyled>
              <NavLink href={link.href}>
                <Icon name={link.icon} />
                {link.title}
              </NavLink>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem key={"logout"} asChild unstyled>
            <Logout />
          </DropdownMenuItem>
        </DropdownMenu>
      )}
    </div>
  )
}
