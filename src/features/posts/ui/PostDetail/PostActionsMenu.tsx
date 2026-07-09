"use client"

import { Icon } from "@/common/components/Icon/Icon"
import type { IconName } from "@/common/components/Icon/IconNameType"
import { DropdownMenuItem } from "@/common/components/DropdownMenu/DropdownMenu"
import { MoreActionsDropdown } from "@/common/components/MoreActionsDropdown/MoreActionsDropdown"
import styles from "@/widgets/Sidebar/NavLink/NavLink.module.css"
import clsx from "clsx"

type PostActionId = "copy-link" | "delete" | "edit" | "report"

type PostActionItem = {
  id: PostActionId
  icon: IconName
  label: string
  variant?: "danger" | "default"
}

const ownPostActions: PostActionItem[] = [
  { id: "edit", icon: "edit2Outline", label: "Edit Post" },
  { id: "delete", icon: "trashOutline", label: "Delete Post", variant: "danger" },
]

const otherPostActions: PostActionItem[] = [
  { id: "report", icon: "personRemoveOutline", label: "Follow" },
  { id: "copy-link", icon: "copyOutline", label: "Copy Link" },
]

type Props = {
  isOwnPost: boolean
  onAction?: (actionId: PostActionId) => void
}

export const PostActionsMenu = ({ isOwnPost, onAction }: Props) => {
  const items = isOwnPost ? ownPostActions : otherPostActions

  return (
    <MoreActionsDropdown>
      {items.map((item) => (
        <DropdownMenuItem
          data-action-id={item.id}
          key={item.id}
          onSelect={() => onAction?.(item.id)}
          unstyled
        >
          <button className={clsx(styles.navLink, "mediumText14", styles.unstyledBtn)}>
            <Icon height={18} name={item.icon} width={18} />
            {item.label}
          </button>
        </DropdownMenuItem>
      ))}
    </MoreActionsDropdown>
  )
}
