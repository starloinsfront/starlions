"use client"

import { DropdownMenuItem } from "@/common/components/DropdownMenu/DropdownMenu"
import { Icon } from "@/common/components/Icon/Icon"
import { MoreActionsDropdown } from "@/common/components/MoreActionsDropdown/MoreActionsDropdown"
import { Logout } from "@/features/auth/ui/Logout/Logout"
import { NavLink } from "@/widgets/Sidebar/NavLink/NavLink"
import { sidebarSections } from "@/widgets/Sidebar/sidebar.data"
import styles from "./DropdownMenuNavItem.module.css"

export const DropdownMenuNavItem = () => {
  return (
    <div className={styles.mobileHeaderLink}>
      <MoreActionsDropdown>
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
      </MoreActionsDropdown>
    </div>
  )
}
