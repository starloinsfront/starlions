"use client"

import { Icon } from "@/common/components/Icon/Icon"
import type { IconName } from "@/common/components/Icon/IconNameType"
import { DropdownMenuItem } from "@/common/components/DropdownMenu/DropdownMenu"
import { MoreActionsDropdown } from "@/common/components/MoreActionsDropdown/MoreActionsDropdown"
import styles from "@/widgets/Sidebar/NavLink/NavLink.module.css"
import clsx from "clsx"
import { useState } from "react"
import { ConfirmationModal } from "@/common/components/ConfirmationModal"
import { useDeletePostMutation } from "@/features/posts/api/useDeletePostMutation"
import { EditPostModal } from "./EditPostModal"

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
  description: string
  isOwnPost: boolean
  onAction?: (actionId: PostActionId) => void
  onDescriptionUpdated?: (description: string) => void
  postId: string
}

export const PostActionsMenu = ({
  description,
  isOwnPost,
  onAction,
  onDescriptionUpdated,
  postId,
}: Props) => {
  const items = isOwnPost ? ownPostActions : otherPostActions
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { mutate } = useDeletePostMutation()

  return (
    <>
      <MoreActionsDropdown>
        {items.map((item) => (
          <DropdownMenuItem
            data-action-id={item.id}
            key={item.id}
            onSelect={() => {
              if (item.id === "delete") {
                setIsDeleteModalOpen(true)
              } else if (item.id === "edit") {
                setIsEditModalOpen(true)
              } else {
                onAction?.(item.id)
              }
            }}
            unstyled
          >
            <button className={clsx(styles.navLink, "mediumText14", styles.unstyledBtn)}>
              <Icon height={18} name={item.icon} width={18} />
              {item.label}
            </button>
          </DropdownMenuItem>
        ))}
      </MoreActionsDropdown>

      <EditPostModal
        description={description}
        isOpen={isEditModalOpen}
        key={`${postId}-${description}`}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onDescriptionUpdated}
        postId={postId}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        message={"Are you sure you want to delete this post?"}
        title={"Delete post"}
        discardBtnText={"No"}
        confirmBtnText={"Yes"}
        onConfirm={() => {
          mutate(postId)
          setIsDeleteModalOpen(false)
        }}
        onDiscard={() => setIsDeleteModalOpen(false)}
      />
    </>
  )
}
