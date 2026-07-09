"use client"

import { useId } from "react"

import { CompoundModal } from "@/common/components/CompoundModal"
import { PostLikesList } from "./PostLikesList"
import s from "./PostLikesModal.module.css"
import type { PostDetailLike } from "./PostDetail.types"

type Props = {
  isAuthorized?: boolean
  isOpen: boolean
  likes: PostDetailLike[]
  onClose: () => void
}

export const PostLikesModal = ({ isAuthorized = true, isOpen, likes, onClose }: Props) => {
  const descriptionId = useId()

  return (
    <CompoundModal.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CompoundModal.Portal>
        <CompoundModal.Overlay className={s.overlay} />
        <CompoundModal.Content
          aria-describedby={descriptionId}
          className={s.content}
          size="lg"
        >
          <CompoundModal.Header className={s.header}>
            <CompoundModal.Title className={s.title}>Likes</CompoundModal.Title>
            <CompoundModal.Close className={s.closeButton} />
          </CompoundModal.Header>
          <CompoundModal.Description id={descriptionId}>
            Users who liked this post.
          </CompoundModal.Description>
          <CompoundModal.MainContent className={s.mainContent}>
            <PostLikesList isAuthorized={isAuthorized} likes={likes} />
          </CompoundModal.MainContent>
        </CompoundModal.Content>
      </CompoundModal.Portal>
    </CompoundModal.Root>
  )
}
