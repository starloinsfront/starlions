"use client"

import clsx from "clsx"
import { useState } from "react"

import { Icon } from "@/common/components/Icon/Icon"
import { Skeleton } from "@/common/components/Skeleton/Skeleton"
import { ROUTES } from "@/common/constants/route"
import { useMe } from "@/features/auth/api/useMe"
import { Logout } from "@/features/auth/ui/Logout/Logout"
import { CreatePostModal } from "@/features/create-post/ui/CreatePostModal"

import { NavLink } from "./NavLink/NavLink"
import navLinkStyles from "./NavLink/NavLink.module.css"
import { sidebarSections } from "./sidebar.data"
import styles from "./Sidebar.module.css"

const SIDEBAR_MAIN_SKELETON_ITEMS = [
  { id: "feed", labelClassName: styles.skeletonLabelShort },
  { id: "create", labelClassName: styles.skeletonLabelMedium },
  { id: "profile", labelClassName: styles.skeletonLabelMedium },
  { id: "messenger", labelClassName: styles.skeletonLabelLong },
  { id: "search", labelClassName: styles.skeletonLabelMedium },
] as const

const SIDEBAR_SECONDARY_SKELETON_ITEMS = [
  { id: "statistics", labelClassName: styles.skeletonLabelLong },
  { id: "favorites", labelClassName: styles.skeletonLabelMedium },
] as const

type SidebarSkeletonItemProps = {
  labelClassName: string
}

const SidebarSkeletonItem = ({ labelClassName }: SidebarSkeletonItemProps) => {
  return (
    <div className={styles.skeletonItem}>
      <Skeleton className={styles.skeletonIcon} />
      <Skeleton className={clsx(styles.skeletonLabel, labelClassName)} />
    </div>
  )
}

export const SidebarSkeleton = () => {
  return (
    <aside
      aria-busy="true"
      aria-label="Loading navigation"
      className={clsx(styles.sidebar, styles.sidebarSkeleton)}
      role="status"
    >
      <div className={styles.skeletonList}>
        {SIDEBAR_MAIN_SKELETON_ITEMS.map(({ id, labelClassName }) => (
          <SidebarSkeletonItem key={id} labelClassName={labelClassName} />
        ))}
      </div>

      <div className={clsx(styles.skeletonList, styles.skeletonSecondary)}>
        {SIDEBAR_SECONDARY_SKELETON_ITEMS.map(({ id, labelClassName }) => (
          <SidebarSkeletonItem key={id} labelClassName={labelClassName} />
        ))}
      </div>

      <div className={styles.skeletonLogout}>
        <SidebarSkeletonItem labelClassName={styles.skeletonLabelMedium} />
      </div>
    </aside>
  )
}

export const Sidebar = () => {
  const { main, secondary } = sidebarSections
  const { data: me } = useMe()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <aside className={styles.sidebar}>
      <nav aria-label="Main navigation" className={styles.sidebarSection}>
        <ul className={styles.navList}>
          {main?.map((link) => {
            const isMyProfileLink = link.href === ROUTES.profile
            const resolvedHref =
              isMyProfileLink && me?.id ? ROUTES.profileById(me.id) : link.href

            return (
              <li key={`${link.title}-${resolvedHref}`}>
                {link.action === "create" ? (
                  <button
                    className={clsx(
                      navLinkStyles.navLink,
                      "mediumText14",
                      styles.actionButton,
                    )}
                    onClick={() => setIsCreateModalOpen(true)}
                    type="button"
                  >
                    <Icon name={link.icon} />
                    <span className={styles.textLink}>{link.title}</span>
                  </button>
                ) : (
                  <NavLink exact={isMyProfileLink} href={resolvedHref}>
                    <Icon name={link.icon} />
                    <span className={styles.textLink}>{link.title}</span>
                  </NavLink>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <nav
        aria-label="Secondary navigation"
        className={clsx(styles.sidebarSection, styles.desktopOnly)}
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

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onCloseAction={() => setIsCreateModalOpen(false)}
        onOpenDraftAction={() => {}}
      />
    </aside>
  )
}
