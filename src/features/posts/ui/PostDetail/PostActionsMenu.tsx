"use client"

import { Icon } from "@/common/components/Icon/Icon"
import type { IconName } from "@/common/components/Icon/IconNameType"
import { DropdownMenuItem } from "@/common/components/DropdownMenu/DropdownMenu"
import { MoreActionsDropdown } from "@/common/components/MoreActionsDropdown/MoreActionsDropdown"
import { ROUTES } from "@/common/constants/route"
import { showErrorToast, showSuccessToast } from "@/common/utils/toast/showToast"
import styles from "@/widgets/Sidebar/NavLink/NavLink.module.css"
import clsx from "clsx"
import { useState } from "react"
import { ConfirmationModal } from "@/common/components/ConfirmationModal"
import { useDeletePostMutation } from "@/features/posts/api/useDeletePostMutation"
import { EditPostModal } from "./EditPostModal"

type PostActionId = "delete" | "edit"

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

const copyTextFallback = (text: string) => {
  const textArea = document.createElement("textarea")

  textArea.value = text
  textArea.setAttribute("readonly", "")
  textArea.style.opacity = "0"
  textArea.style.pointerEvents = "none"
  textArea.style.position = "fixed"

  document.body.append(textArea)
  textArea.select()

  try {
    return document.execCommand("copy")
  } finally {
    textArea.remove()
  }
}

const copyPostLink = async (postId: string) => {
  const postUrl = new URL(ROUTES.postById(postId), window.location.origin).toString()

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(postUrl)

      return
    } catch {
      // Fall back when Clipboard API is unavailable or blocked by browser permissions.
    }
  }

  if (!copyTextFallback(postUrl)) {
    throw new Error("Unable to copy post link")
  }
}

type Props = {
  description: string
  isAuthorized: boolean
  isFollowing?: boolean
  isOwnPost: boolean
  onFollowToggle?: () => void
  onDescriptionUpdated?: (description: string) => void
  postId: string
}

export const PostActionsMenu = ({
  description,
  isAuthorized,
  isFollowing: controlledIsFollowing,
  isOwnPost,
  onFollowToggle,
  onDescriptionUpdated,
  postId,
}: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [localIsFollowing, setLocalIsFollowing] = useState(false)
  const { mutate } = useDeletePostMutation()
  const isFollowing = controlledIsFollowing ?? localIsFollowing

  const handleCopyLink = async () => {
    try {
      await copyPostLink(postId)
      showSuccessToast("Post link copied")
    } catch {
      showErrorToast("Unable to copy post link")
    }
  }

  const handleFollowToggle = () => {
    if (onFollowToggle) {
      onFollowToggle()

      return
    }

    setLocalIsFollowing((currentValue) => !currentValue)
  }

  return (
    <>
      <MoreActionsDropdown>
        {isAuthorized && isOwnPost
          ? ownPostActions.map((item) => (
              <DropdownMenuItem
                data-action-id={item.id}
                key={item.id}
                onSelect={() => {
                  if (item.id === "delete") {
                    setIsDeleteModalOpen(true)
                  } else if (item.id === "edit") {
                    setIsEditModalOpen(true)
                  }
                }}
                unstyled
              >
                <button
                  className={clsx(styles.navLink, "mediumText14", styles.unstyledBtn)}
                  type="button"
                >
                  <Icon height={18} name={item.icon} width={18} />
                  {item.label}
                </button>
              </DropdownMenuItem>
            ))
          : null}

        {isAuthorized && !isOwnPost ? (
          <DropdownMenuItem
            data-action-id="follow"
            onSelect={handleFollowToggle}
            unstyled
          >
            <button
              aria-pressed={isFollowing}
              className={clsx(styles.navLink, "mediumText14", styles.unstyledBtn)}
              type="button"
            >
              <Icon
                height={18}
                name={isFollowing ? "personRemoveOutline" : "personAddOutline"}
                width={18}
              />
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem
          data-action-id="copy-link"
          onSelect={() => void handleCopyLink()}
          unstyled
        >
          <button
            className={clsx(styles.navLink, "mediumText14", styles.unstyledBtn)}
            type="button"
          >
            <Icon height={18} name="copyOutline" width={18} />
            Copy Link
          </button>
        </DropdownMenuItem>
      </MoreActionsDropdown>

      {isAuthorized && isOwnPost ? (
        <>
          <EditPostModal
            description={description}
            isOpen={isEditModalOpen}
            key={`${postId}-${description}`}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={onDescriptionUpdated}
            postId={postId}
          />

          <ConfirmationModal
            confirmBtnText="Yes"
            discardBtnText="No"
            isOpen={isDeleteModalOpen}
            message="Are you sure you want to delete this post?"
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              mutate(postId)
              setIsDeleteModalOpen(false)
            }}
            onDiscard={() => setIsDeleteModalOpen(false)}
            title="Delete post"
          />
        </>
      ) : null}
    </>
  )
}
