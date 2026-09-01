"use client"

import { useState } from "react"

import { useMe } from "@/features/auth/api/useMe"
import { PostDetailMedia } from "./PostDetailMedia"
import { PostDetailSidebar } from "./PostDetailSidebar"
import { PostLikesModal } from "./PostLikesModal"
import { PostMobileView } from "./PostMobileView"
import { usePostLayoutMode } from "./usePostLayoutMode"
import s from "./PostDetail.module.css"
import type { PostDetailData } from "./PostDetail.types"

type MobilePanel = "comments" | "likes" | null

type Props = {
  isModal?: boolean
  post: PostDetailData
}

export const PostDetail = ({ isModal = false, post }: Props) => {
  const { data: me } = useMe()
  const { isTabletOrMobile } = usePostLayoutMode()
  const [description, setDescription] = useState(post.description)

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null)

  const isAuthorized = Boolean(me?.id)
  const isOwnPost = Boolean(me?.id && me.id === post.author.authorId)
  const postWithDescription = { ...post, description }

  const handleOpenComments = () => setMobilePanel("comments")
  const handleOpenLikes = () => setMobilePanel("likes")
  const handleResetPanel = () => setMobilePanel(null)

  if (isTabletOrMobile) {
    return (
      <PostMobileView
        activePanel={mobilePanel}
        isAuthorized={isAuthorized}
        isOwnPost={isOwnPost}
        onDescriptionUpdated={setDescription}
        onOpenCommentsAction={handleOpenComments}
        onOpenLikesAction={handleOpenLikes}
        onResetPanelAction={handleResetPanel}
        post={postWithDescription}
        showAppBar={isModal}
        showBackNavigation={!isModal}
      />
    )
  }

  return (
    <article className={s.root}>
      <div className={s.desktopLayout}>
        <PostDetailMedia images={post.images} />
        <PostDetailSidebar
          isAuthorized={isAuthorized}
          isOwnPost={isOwnPost}
          onDescriptionUpdated={setDescription}
          onOpenLikes={() => setIsLikesModalOpen(true)}
          post={postWithDescription}
        />
      </div>

      <PostLikesModal
        isAuthorized={isAuthorized}
        isOpen={isLikesModalOpen}
        likes={post.likes}
        onCloseAction={() => setIsLikesModalOpen(false)}
      />
    </article>
  )
}
