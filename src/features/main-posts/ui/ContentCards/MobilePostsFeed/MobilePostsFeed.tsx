"use client"

import { useState } from "react"

import { Icon } from "@/common/components/Icon/Icon"
import { useMe } from "@/features/auth/api/useMe"
import { formatPostDate } from "@/features/posts/lib/formatPostDate"
import { getUserInitials } from "@/features/posts/lib/userInitials"
import type { PostDetailData, PublicPost } from "@/features/posts/model/post.types"
import { PostActionsMenu } from "@/features/posts/ui/PostDetail/PostActionsMenu"
import { PostCommentsList } from "@/features/posts/ui/PostDetail/PostCommentsList"
import { PostDetailMedia } from "@/features/posts/ui/PostDetail/PostDetailMedia"
import { PostLikesAvatarStack } from "@/features/posts/ui/PostDetail/PostLikesAvatarStack"
import { PostLikesList } from "@/features/posts/ui/PostDetail/PostLikesList"
import { PostMobilePanelModal } from "@/features/posts/ui/PostDetail/PostMobilePanelModal"
import s from "./MobilePostsFeed.module.css"

type ActivePanel = {
  post: PostDetailData
  type: "comments" | "likes"
} | null

type Props = {
  posts: PublicPost[]
}

const COMMENTS_PREVIEW_LIMIT = 2

const formatMetric = (value: number) => new Intl.NumberFormat("ru-RU").format(value)

const toPostDetailData = (post: PublicPost): PostDetailData => ({
  ...post,
  comments: [],
  likes: [],
  likesCount: 0,
})

export const MobilePostsFeed = ({ posts }: Props) => {
  const { data: me } = useMe()
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)

  const isAuthorized = Boolean(me?.id)
  const activePost = activePanel?.post

  return (
    <>
      <section aria-label="Latest public posts" className={s.feed}>
        {posts.map((post) => {
          const isOwnPost = Boolean(me?.id && me.id === post.author.authorId)
          const detailPost = toPostDetailData(post)

          return (
            <article className={s.post} key={post.id}>
              <header className={s.postHeader}>
                <div className={s.authorInfo}>
                  <span aria-hidden="true" className={s.avatar}>
                    {getUserInitials(post.author.username)}
                  </span>
                  <span className={s.username}>{post.author.username}</span>
                </div>

                {isAuthorized && <PostActionsMenu isOwnPost={isOwnPost} />}
              </header>

              <PostDetailMedia images={post.images} variant="mobile" />

              <div className={s.postBody}>
                <div aria-label="Post actions" className={s.actionsRow}>
                  <div className={s.actionsGroup}>
                    {isAuthorized && (
                      <button aria-label="Like post" className={s.iconButton} type="button">
                        <Icon height={24} name="heartOutline" width={24} />
                      </button>
                    )}

                    <button
                      aria-label="Open comments"
                      className={s.iconButton}
                      onClick={() => setActivePanel({ post: detailPost, type: "comments" })}
                      type="button"
                    >
                      <Icon height={24} name="messageCircleOutline" width={24} />
                    </button>

                    {isAuthorized && (
                      <button aria-label="Share post" className={s.iconButton} type="button">
                        <Icon height={24} name="paperPlaneOutline" width={24} />
                      </button>
                    )}
                  </div>
                  {isAuthorized && (
                    <button aria-label="Save post" className={s.iconButton} type="button">
                      <Icon height={24} name="bookmarkOutline" width={24} />
                    </button>
                  )}
                </div>

                <button
                  className={s.likesButton}
                  onClick={() => setActivePanel({ post: detailPost, type: "likes" })}
                  type="button"
                >
                  <PostLikesAvatarStack likes={[]} />
                  <span>{formatMetric(0)} &quot;Like&quot;</span>
                </button>

                {post.description && (
                  <p className={s.description}>
                    <strong>{post.author.username}</strong>
                    {post.description}
                  </p>
                )}

                {(detailPost.comments ?? []).length > 0 && (
                  <button
                    className={s.viewCommentsButton}
                    onClick={() => setActivePanel({ post: detailPost, type: "comments" })}
                    type="button"
                  >
                    View all Comments ({(detailPost.comments ?? []).length + 1})
                  </button>
                )}

                <div className={s.previewComments}>
                  {(detailPost.comments ?? []).slice(0, COMMENTS_PREVIEW_LIMIT).map((comment) => (
                    <div className={s.previewComment} key={comment.id}>
                      <p>
                        <strong>{comment.username}</strong>
                        {comment.text}
                      </p>
                      <button
                        aria-label={comment.isLiked ? "Unlike comment" : "Like comment"}
                        className={s.commentLikeButton}
                        data-liked={Boolean(comment.isLiked)}
                        type="button"
                      >
                        <Icon
                          height={16}
                          name={comment.isLiked ? "heartFilled" : "heartOutline"}
                          width={16}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <time className={s.date} dateTime={post.createdAt}>
                  {formatPostDate(post.createdAt)}
                </time>
              </div>
            </article>
          )
        })}
      </section>

      <PostMobilePanelModal
        description="Post comments."
        isOpen={activePanel?.type === "comments"}
        onClose={() => setActivePanel(null)}
        reserveBottomNavigation={isAuthorized}
        title="Comments"
      >
        {activePost ? (
          <PostCommentsList
            author={activePost.author}
            className={s.modalList}
            createdAt={activePost.createdAt}
            comments={activePost.comments ?? []}
            description={activePost.description}
            isAuthorized={isAuthorized}
            variant="mobile"
          />
        ) : null}
      </PostMobilePanelModal>

      <PostMobilePanelModal
        description="Users who liked this post."
        isOpen={activePanel?.type === "likes"}
        onClose={() => setActivePanel(null)}
        reserveBottomNavigation={isAuthorized}
        title="Likes"
      >
        <div className={s.modalPaddedContent}>
          {activePost ? <PostLikesList likes={activePost.likes ?? []} variant="mobile" /> : null}
        </div>
      </PostMobilePanelModal>
    </>
  )
}
