"use client"

import { Icon } from "@/common/components/Icon/Icon"
import { formatPostDate } from "@/features/posts/lib/formatPostDate"
import { getUserInitials } from "@/features/posts/lib/userInitials"
import { PostActionsMenu } from "./PostActionsMenu"
import { PostCommentsList } from "./PostCommentsList"
import { PostDetailMedia } from "./PostDetailMedia"
import { PostLikesList } from "./PostLikesList"
import { PostMetaFooter } from "./PostMetaFooter"
import { PostMobilePanelModal } from "./PostMobilePanelModal"
import s from "./PostMobileView.module.css"
import type { PostDetailData } from "./PostDetail.types"

type MobilePanel = "comments" | "likes" | null

type Props = {
  activePanel: MobilePanel
  isAuthorized: boolean
  isOwnPost: boolean
  onOpenComments: () => void
  onOpenLikes: () => void
  onResetPanel: () => void
  post: PostDetailData
  showAppBar?: boolean
}

const MOBILE_COMMENTS_PREVIEW_LIMIT = 1

export const PostMobileView = ({
  activePanel,
  isAuthorized,
  isOwnPost,
  onOpenComments,
  onOpenLikes,
  onResetPanel,
  post,
  showAppBar = false,
}: Props) => {
  const previewComments = post.comments.slice(0, MOBILE_COMMENTS_PREVIEW_LIMIT)

  return (
    <section className={s.root}>
      {showAppBar && <MobileAppBar isAuthorized={isAuthorized} isOwnPost={isOwnPost} />}

      <article className={s.postCard}>
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

        <div className={s.body}>
          <PostMetaFooter
            commentsCount={post.comments.length}
            createdAt={post.createdAt}
            isAuthorized={isAuthorized}
            likes={post.likes}
            likesCount={post.likesCount}
            onCommentsClick={onOpenComments}
            onLikesClick={onOpenLikes}
            variant="mobile"
          />

          {post.description && (
            <p className={s.description}>
              <strong>{post.author.username}</strong>
              {post.description}
            </p>
          )}

          <div className={s.previewComments}>
            {previewComments.map((comment) => (
              <div className={s.previewComment} key={comment.id}>
                <p>
                  <strong>{comment.username}</strong>
                  {comment.text}
                </p>
                {isAuthorized ? (
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
                ) : null}
              </div>
            ))}
          </div>

          <time className={s.date} dateTime={post.createdAt}>
            {formatPostDate(post.createdAt)}
          </time>
        </div>
      </article>

      <PostMobilePanelModal
        description="Post comments."
        isOpen={activePanel === "comments"}
        onClose={onResetPanel}
        reserveBottomNavigation={isAuthorized}
        title="Comments"
      >
        <PostCommentsList
          author={post.author}
          className={s.modalList}
          comments={post.comments}
          createdAt={post.createdAt}
          description={post.description}
          isAuthorized={isAuthorized}
          variant="mobile"
        />
      </PostMobilePanelModal>

      <PostMobilePanelModal
        description="Users who liked this post."
        isOpen={activePanel === "likes"}
        onClose={onResetPanel}
        reserveBottomNavigation={isAuthorized}
        title="Likes"
      >
        <div className={s.modalPaddedContent}>
          <PostLikesList likes={post.likes} variant="mobile" />
        </div>
      </PostMobilePanelModal>
    </section>
  )
}

type MobileAppBarProps = {
  isAuthorized: boolean
  isOwnPost: boolean
}

const MobileAppBar = ({ isAuthorized, isOwnPost }: MobileAppBarProps) => {
  return (
    <header className={s.appBar}>
      <span className={s.logo}>Inctagram</span>
      <div className={s.appBarActions}>
        <button aria-label="Change language" className={s.languageButton} type="button">
          <Icon height={18} name="flagRussiaFilled" width={18} />
          <Icon className={s.languageChevron} height={16} name="arrowIosDownOutline" width={16} />
        </button>
        {isAuthorized && <PostActionsMenu isOwnPost={isOwnPost} />}
      </div>
    </header>
  )
}
