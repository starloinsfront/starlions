"use client"

import Link from "next/link"
import clsx from "clsx"
import { useMemo, useState } from "react"

import { Icon } from "@/common/components/Icon/Icon"
import { ROUTES } from "@/common/constants/route"
import { useMe } from "@/features/auth/api/useMe"
import { formatPostDate, formatRelativeTime } from "@/features/posts/lib/formatPostDate"
import { getUserInitials } from "@/features/posts/lib/userInitials"
import type { PostDetailData, PublicPost } from "@/features/posts/model/post.types"
import { PostActionsMenu } from "@/features/posts/ui/PostDetail/PostActionsMenu"
import { PostCommentsList } from "@/features/posts/ui/PostDetail/PostCommentsList"
import { PostDetailMedia } from "@/features/posts/ui/PostDetail/PostDetailMedia"
import { PostLikesAvatarStack } from "@/features/posts/ui/PostDetail/PostLikesAvatarStack"
import { PostLikesList } from "@/features/posts/ui/PostDetail/PostLikesList"
import { PostMobilePanelModal } from "@/features/posts/ui/PostDetail/PostMobilePanelModal"
import { PostCardDescription } from "../PostCard/Description/PostCardDescription"
import s from "./MobilePostsFeed.module.css"

type ActivePanel = {
  post: PostDetailData
  type: "comments" | "likes"
} | null

type Props = {
  postHrefBase?: string
  posts: PublicPost[]
}

const COMMENTS_PREVIEW_LIMIT = 2
const DESCRIPTION_PREVIEW_LIMIT = 83

const formatMetric = (value: number) => new Intl.NumberFormat("ru-RU").format(value)

const toPostDetailData = (post: PublicPost): PostDetailData => ({
  ...post,
  comments: [],
  interactionsAvailable: false,
  likes: [],
  likesCount: 0,
})

const getPreviewDescription = (description: string) => {
  if (description.length <= DESCRIPTION_PREVIEW_LIMIT) {
    return description
  }

  return `${description.slice(0, DESCRIPTION_PREVIEW_LIMIT).trimEnd()}...`
}

type ResponsivePostProps = {
  isAuthorized: boolean
  meId?: string
  onOpenPanel: (post: PostDetailData, type: "comments" | "likes") => void
  post: PublicPost
  postHrefBase: string
}

const ResponsivePost = ({
  isAuthorized,
  meId,
  onOpenPanel,
  post,
  postHrefBase,
}: ResponsivePostProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const canExpand = post.description.length > DESCRIPTION_PREVIEW_LIMIT
  const previewDescription = useMemo(
    () => getPreviewDescription(post.description),
    [post.description]
  )
  const isOwnPost = Boolean(meId && meId === post.author.authorId)
  const detailPost = toPostDetailData(post)

  return (
    <article className={clsx(s.post, isExpanded && s.postExpanded)}>
      <header className={s.postHeader}>
        <Link
          aria-label={`Open ${post.author.username} profile`}
          className={s.authorInfo}
          href={ROUTES.profileById(post.author.authorId)}
          prefetch={false}
        >
          <span aria-hidden="true" className={s.avatar}>
            {getUserInitials(post.author.username)}
          </span>
          <span className={s.username}>{post.author.username}</span>
        </Link>

        <div className={s.mobileActionsMenu}>
          <PostActionsMenu
            description={post.description}
            isAuthorized={isAuthorized}
            isOwnPost={isOwnPost}
            postId={post.id}
          />
        </div>
      </header>

      <PostDetailMedia
        className={s.postMedia}
        href={ROUTES.postModalById(postHrefBase, post.id)}
        images={post.images}
        sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 25vw"
        variant="mobile"
      />

      <div className={s.desktopMeta}>
        <PostCardDescription
          canExpand={canExpand}
          description={post.description}
          isExpanded={isExpanded}
          onToggleAction={() => setIsExpanded((current) => !current)}
          previewDescription={previewDescription}
          time={formatRelativeTime(post.createdAt)}
        />
      </div>

      <div className={s.mobileBody}>
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
              onClick={() => onOpenPanel(detailPost, "comments")}
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
          onClick={() => onOpenPanel(detailPost, "likes")}
          type="button"
        >
          <PostLikesAvatarStack likes={detailPost.likes} />
          <span>{formatMetric(detailPost.likesCount)} &quot;Like&quot;</span>
        </button>

        {post.description && (
          <p className={s.description}>
            <strong>{post.author.username}</strong>
            {post.description}
          </p>
        )}

        {detailPost.comments.length > 0 && (
          <button
            className={s.viewCommentsButton}
            onClick={() => onOpenPanel(detailPost, "comments")}
            type="button"
          >
            View all Comments ({detailPost.comments.length + 1})
          </button>
        )}

        <div className={s.previewComments}>
          {detailPost.comments.slice(0, COMMENTS_PREVIEW_LIMIT).map((comment) => (
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
}

export const MobilePostsFeed = ({ postHrefBase = "/", posts }: Props) => {
  const { data: me } = useMe()
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)

  const isAuthorized = Boolean(me?.id)
  const activePost = activePanel?.post

  return (
    <>
      <section aria-label="Latest public posts" className={s.feed}>
        {posts.map((post) => (
          <ResponsivePost
            isAuthorized={isAuthorized}
            key={post.id}
            meId={me?.id}
            onOpenPanel={(selectedPost, type) => setActivePanel({ post: selectedPost, type })}
            post={post}
            postHrefBase={postHrefBase}
          />
        ))}
      </section>

      <PostMobilePanelModal
        description="Post comments."
        isOpen={activePanel?.type === "comments"}
        onCloseAction={() => setActivePanel(null)}
        reserveBottomNavigation={isAuthorized}
        title="Comments"
      >
        {activePost ? (
          <PostCommentsList
            author={activePost.author}
            className={s.modalList}
            comments={activePost.comments}
            createdAt={activePost.createdAt}
            description={activePost.description}
            isAuthorized={isAuthorized}
            variant="mobile"
          />
        ) : null}
      </PostMobilePanelModal>

      <PostMobilePanelModal
        description="Users who liked this post."
        isOpen={activePanel?.type === "likes"}
        onCloseAction={() => setActivePanel(null)}
        reserveBottomNavigation={isAuthorized}
        title="Likes"
      >
        <div className={s.modalPaddedContent}>
          {activePost ? (
            <PostLikesList
              isAuthorized={isAuthorized}
              likes={activePost.likes}
              variant="mobile"
            />
          ) : null}
        </div>
      </PostMobilePanelModal>
    </>
  )
}
