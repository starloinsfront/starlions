"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Icon } from "@/common/components/Icon/Icon"
import { ROUTES } from "@/common/constants/route"
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
  onDescriptionUpdated?: (description: string) => void
  onOpenCommentsAction: () => void
  onOpenLikesAction: () => void
  onResetPanelAction: () => void
  post: PostDetailData
  showAppBar?: boolean
  showBackNavigation?: boolean
}

const MOBILE_COMMENTS_PREVIEW_LIMIT = 1

export const PostMobileView = ({
  activePanel,
  isAuthorized,
  isOwnPost,
  onDescriptionUpdated,
  onOpenCommentsAction,
  onOpenLikesAction,
  onResetPanelAction,
  post,
  showAppBar = false,
  showBackNavigation = false,
}: Props) => {
  const router = useRouter()
  const previewComments = post.comments.slice(0, MOBILE_COMMENTS_PREVIEW_LIMIT)

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()

      return
    }

    router.replace(ROUTES.home)
  }

  return (
    <section className={s.root}>
      {showAppBar && (
        <MobileAppBar
          description={post.description}
          isAuthorized={isAuthorized}
          isOwnPost={isOwnPost}
          onDescriptionUpdated={onDescriptionUpdated}
          postId={post.id}
        />
      )}

      {showBackNavigation ? (
        <nav aria-label="Post navigation" className={s.navigationBar}>
          <button
            aria-label="Go back"
            className={s.backButton}
            onClick={handleBack}
            type="button"
          >
            <Icon height={24} name="arrowBackOutline" width={24} />
          </button>
          <span className={s.navigationTitle}>Post</span>
          <span aria-hidden="true" className={s.navigationSpacer} />
        </nav>
      ) : null}

      <article className={s.postCard}>
        <header className={s.postHeader}>
          <Link
            aria-label={`Open ${post.author.username} profile`}
            className={s.authorInfo}
            href={ROUTES.profileById(post.author.authorId)}
          >
            <span aria-hidden="true" className={s.avatar}>
              {getUserInitials(post.author.username)}
            </span>
            <span className={s.username}>{post.author.username}</span>
          </Link>

          {isAuthorized && (
            <PostActionsMenu
              description={post.description}
              isOwnPost={isOwnPost}
              onDescriptionUpdated={onDescriptionUpdated}
              postId={post.id}
            />
          )}
        </header>

        <PostDetailMedia images={post.images} variant="mobile-detail" />

        <div className={s.body}>
          <PostMetaFooter
            commentsCount={post.comments.length}
            createdAt={post.createdAt}
            isAuthorized={isAuthorized}
            likes={post.likes}
            likesCount={post.likesCount}
            onCommentsClick={onOpenCommentsAction}
            onLikesClick={onOpenLikesAction}
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
        onCloseAction={onResetPanelAction}
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
        onCloseAction={onResetPanelAction}
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
  description: string
  isAuthorized: boolean
  isOwnPost: boolean
  onDescriptionUpdated?: (description: string) => void
  postId: string
}

const MobileAppBar = ({
  description,
  isAuthorized,
  isOwnPost,
  onDescriptionUpdated,
  postId,
}: MobileAppBarProps) => {
  return (
    <header className={s.appBar}>
      <span className={s.logo}>Inctagram</span>
      <div className={s.appBarActions}>
        <button aria-label="Change language" className={s.languageButton} type="button">
          <Icon height={18} name="flagRussiaFilled" width={18} />
          <Icon className={s.languageChevron} height={16} name="arrowIosDownOutline" width={16} />
        </button>
        {isAuthorized && (
          <PostActionsMenu
            description={description}
            isOwnPost={isOwnPost}
            onDescriptionUpdated={onDescriptionUpdated}
            postId={postId}
          />
        )}
      </div>
    </header>
  )
}
