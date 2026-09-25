"use client"

import { useState } from "react"

import { useMe } from "@/features/auth/api/useMe"
import { PostLikesModal } from "./PostLikesModal"
import { PostMobileView } from "./PostMobileView"
import s from "./PostDetail.module.css"
import type { PostDetailData } from "./PostDetail.types"

type MobilePanel = "comments" | "likes" | null

type Props = {
  isModal?: boolean
  post: PostDetailData
}

export const PostDetail = ({ isModal = false, post }: Props) => {
  const { data: me } = useMe()
  const [description, setDescription] = useState(post.description)

  const [isFollowing, setIsFollowing] = useState(false)
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null)

  const isAuthorized = Boolean(me?.id)
  const isOwnPost = Boolean(me?.id && me.id === post.author.authorId)
  const postWithDescription = { ...post, description }

  const handleOpenComments = () => setMobilePanel("comments")
  const handleOpenLikes = () => {
    setIsLikesModalOpen(true)
    setMobilePanel("likes")
  }
  const handleResetPanel = () => setMobilePanel(null)

  return (
    <article className={s.root}>
      <PostMobileView
        activePanel={mobilePanel}
        isAuthorized={isAuthorized}
        isFollowing={isFollowing}
        isOwnPost={isOwnPost}
        isModal={isModal}
        onDescriptionUpdated={setDescription}
        onFollowToggle={() => setIsFollowing((currentValue) => !currentValue)}
        onOpenCommentsAction={handleOpenComments}
        onOpenLikesAction={handleOpenLikes}
        onResetPanelAction={handleResetPanel}
        post={postWithDescription}
        showAppBar={isModal}
        showBackNavigation={!isModal}
      />

      <PostLikesModal
        isAuthorized={isAuthorized}
        isOpen={isLikesModalOpen}
        likes={post.likes}
        onCloseAction={() => setIsLikesModalOpen(false)}
      />
    </article>
  )
}
