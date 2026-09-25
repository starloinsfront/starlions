"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import clsx from "clsx"

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
  isFollowing: boolean
  isModal?: boolean
  isOwnPost: boolean
  onDescriptionUpdated?: (description: string) => void
  onFollowToggle: () => void
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
  isFollowing,
  isModal = false,
  isOwnPost,
  onDescriptionUpdated,
  onFollowToggle,
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
    <section className={clsx(s.root, isModal && s.modal)}>
      {showAppBar && (
        <MobileAppBar
          description={post.description}
          isAuthorized={isAuthorized}
          isFollowing={isFollowing}
          isOwnPost={isOwnPost}
          onDescriptionUpdated={onDescriptionUpdated}
          onFollowToggle={onFollowToggle}
          postId={post.id}
          isModal={isModal}
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
            prefetch={false}
          >
            <span aria-hidden="true" className={s.avatar}>
              {getUserInitials(post.author.username)}
            </span>
            <span className={s.username}>{post.author.username}</span>
          </Link>

          <PostActionsMenu
            description={post.description}
            isAuthorized={isAuthorized}
            isFollowing={isFollowing}
            isOwnPost={isOwnPost}
            onDescriptionUpdated={onDescriptionUpdated}
            onFollowToggle={onFollowToggle}
            postId={post.id}
          />
        </header>

        <PostDetailMedia
          className={s.media}
          images={post.images}
          sizes="(max-width: 768px) 100vw, 50vw"
          variant="mobile-detail"
        />

        <div className={s.body}>
          <PostCommentsList
            author={post.author}
            className={s.desktopComments}
            comments={post.comments}
            createdAt={post.createdAt}
            description={post.description}
            isAuthorized={isAuthorized}
          />

          <PostMetaFooter
            className={s.metaFooter}
            commentsCount={post.comments.length}
            createdAt={post.createdAt}
            interactionsAvailable={post.interactionsAvailable}
            isAuthorized={isAuthorized}
            likes={post.likes}
            likesCount={post.likesCount}
            onCommentsClick={onOpenCommentsAction}
            onLikesClick={onOpenLikesAction}
            variant="responsive"
          />

          {post.description && (
            <p className={clsx(s.description, s.mobileOnly)}>
              <strong>{post.author.username}</strong>
              {post.description}
            </p>
          )}

          <div className={clsx(s.previewComments, s.mobileOnly)}>
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

          <time className={clsx(s.date, s.mobileOnly)} dateTime={post.createdAt}>
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
          <PostLikesList isAuthorized={isAuthorized} likes={post.likes} variant="mobile" />
        </div>
      </PostMobilePanelModal>
    </section>
  )
}

type MobileAppBarProps = {
  description: string
  isAuthorized: boolean
  isFollowing: boolean
  isModal: boolean
  isOwnPost: boolean
  onDescriptionUpdated?: (description: string) => void
  onFollowToggle: () => void
  postId: string
}

const MobileAppBar = ({
  description,
  isAuthorized,
  isFollowing,
  isModal,
  isOwnPost,
  onDescriptionUpdated,
  onFollowToggle,
  postId,
}: MobileAppBarProps) => {
  return (
    <header className={clsx(s.appBar, isModal && s.modalAppBar)}>
      <span className={s.logo}>Inctagram</span>
      <div className={s.appBarActions}>
        <button aria-label="Change language" className={s.languageButton} type="button">
          <Icon height={18} name="flagRussiaFilled" width={18} />
          <Icon className={s.languageChevron} height={16} name="arrowIosDownOutline" width={16} />
        </button>
        <PostActionsMenu
          description={description}
          isAuthorized={isAuthorized}
          isFollowing={isFollowing}
          isOwnPost={isOwnPost}
          onDescriptionUpdated={onDescriptionUpdated}
          onFollowToggle={onFollowToggle}
          postId={postId}
        />
      </div>
    </header>
  )
}
