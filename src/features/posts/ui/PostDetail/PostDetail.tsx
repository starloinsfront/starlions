"use client"

import { useState } from "react"

import { useMe } from "@/features/auth/api/useMe"
import { PostDetailMedia } from "./PostDetailMedia"
import { PostDetailSidebar } from "./PostDetailSidebar"
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
  const handleOpenLikes = () => setMobilePanel("likes")
  const handleResetPanel = () => setMobilePanel(null)

  return (
    <>
      <div className={s.desktopView}>
        <article className={s.root}>
          <div className={s.desktopLayout}>
            <PostDetailMedia images={post.images} />
            <PostDetailSidebar
              isAuthorized={isAuthorized}
              isFollowing={isFollowing}
              isOwnPost={isOwnPost}
              onDescriptionUpdated={setDescription}
              onFollowToggle={() => setIsFollowing((currentValue) => !currentValue)}
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
      </div>

      <div className={s.mobileView}>
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
      </div>
    </>
  )
}
