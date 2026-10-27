"use client"

import { DropdownMenuItem } from "@/common/components/DropdownMenu/DropdownMenu"
import { Icon } from "@/common/components/Icon/Icon"
import { MoreActionsDropdown } from "@/common/components/MoreActionsDropdown/MoreActionsDropdown"
import { useMe } from "@/features/auth/api/useMe"
import { Logout } from "@/features/auth/ui/Logout/Logout"
import { NavLink } from "@/widgets/Sidebar/NavLink/NavLink"
import { resolveSidebarHref } from "@/widgets/Sidebar/resolveSidebarHref"
import { sidebarSections } from "@/widgets/Sidebar/sidebar.data"
import styles from "./DropdownMenuNavItem.module.css"

export const DropdownMenuNavItem = () => {
  const { data: me } = useMe()

  return (
    <div className={styles.mobileHeaderLink}>
      <MoreActionsDropdown>
        {sidebarSections.secondary?.map((link) => {
          const href = resolveSidebarHref(link, me?.id)

          if (!href) {
            return null
          }

          return (
            <DropdownMenuItem key={href} asChild unstyled>
              <NavLink href={href}>
                <Icon name={link.icon} />
                {link.title}
              </NavLink>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuItem key={"logout"} asChild unstyled>
          <Logout />
        </DropdownMenuItem>
      </MoreActionsDropdown>
    </div>
  )
}
