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
  const { isMobile } = usePostLayoutMode()

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null)

  const isAuthorized = Boolean(me?.id)
  const isOwnPost = Boolean(me?.id && me.id === post.author.authorId)

  const handleOpenComments = () => setMobilePanel("comments")
  const handleOpenLikes = () => setMobilePanel("likes")
  const handleResetPanel = () => setMobilePanel(null)

  if (isMobile) {
    return (
      <PostMobileView
        activePanel={mobilePanel}
        isAuthorized={isAuthorized}
        isOwnPost={isOwnPost}
        onOpenCommentsAction={handleOpenComments}
        onOpenLikesAction={handleOpenLikes}
        onResetPanelAction={handleResetPanel}
        post={post}
        showAppBar={isModal}
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
          onOpenLikes={() => setIsLikesModalOpen(true)}
          post={post}
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
