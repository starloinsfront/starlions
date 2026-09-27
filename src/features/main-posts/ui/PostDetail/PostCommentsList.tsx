import clsx from "clsx"

import { Icon } from "@/common/components/Icon/Icon"
import { getUserInitials } from "@/features/main-posts/lib/userInitials"
import { formatRelativeTime } from "@/features/main-posts/lib/formatPostDate"
import { PostAvatar } from "./PostAvatar"
import s from "./PostCommentsList.module.css"
import { PostDetailAuthor, PostDetailComment } from "./PostDetail.types"

type Props = {
  author: PostDetailAuthor
  className?: string
  comments: PostDetailComment[]
  createdAt?: string
  description: string
  isAuthorized?: boolean
  variant?: "desktop" | "mobile"
}

export const PostCommentsList = ({
  author,
  className,
  comments,
  createdAt,
  description,
  isAuthorized = false,
  variant = "desktop",
}: Props) => {
  const showMetaActions = isAuthorized || variant === "mobile"

  return (
    <div className={clsx(s.comments, variant === "mobile" && s.mobile, className)}>
      {description && (
        <CommentRow
          avatarLabel={getUserInitials(author.username)}
          isDescription
          text={description}
          time={createdAt ? formatRelativeTime(createdAt) : "recently"}
          username={author.username}
        />
      )}

      {comments.map((comment) => (
        <CommentRow
          comment={comment}
          key={comment.id}
          showMetaActions={showMetaActions}
          variant={variant}
        />
      ))}
    </div>
  )
}

type CommentRowProps = {
  avatarLabel?: string
  comment?: PostDetailComment
  isDescription?: boolean
  showMetaActions?: boolean
  text?: string
  time?: string
  username?: string
  variant?: "desktop" | "mobile"
}

const CommentRow = ({
  avatarLabel,
  comment,
  isDescription = false,
  showMetaActions = false,
  text,
  time,
  username,
  variant = "desktop",
}: CommentRowProps) => {
  const hasLikeAction = showMetaActions && !isDescription
  const rowAvatarLabel = avatarLabel ?? comment?.avatarLabel ?? "U"
  const rowText = text ?? comment?.text ?? ""
  const rowTime = time ?? comment?.time ?? "2 hours ago"
  const rowUsername = username ?? comment?.username ?? "UserName"
  const answersCount = comment?.answersCount ?? comment?.replies?.length ?? 0
  const isLiked = Boolean(comment?.isLiked)
  const likesCount = comment?.likesCount ?? 0
  const replyLabel = variant === "mobile" ? "Hide Answers" : `View Answers (${answersCount})`

  return (
    <div className={s.rowGroup}>
      <div
        className={clsx(s.comment, isDescription && s.descriptionRow, hasLikeAction && s.withLike)}
      >
        <PostAvatar label={rowAvatarLabel} size="md" />

        <div className={s.commentBody}>
          <p className={s.commentText}>
            <strong>{rowUsername}</strong>
            {rowText}
          </p>

          <div className={s.commentMeta}>
            <span className={s.timestamp}>{rowTime}</span>
            {showMetaActions && likesCount > 0 ? <span>Like: {likesCount}</span> : null}
            {hasLikeAction ? <button type="button">Answer</button> : null}
          </div>

          {showMetaActions && answersCount > 0 ? (
            <button className={s.answersButton} type="button">
              <span aria-hidden="true" />
              {replyLabel}
            </button>
          ) : null}
        </div>

        {hasLikeAction ? (
          <button
            aria-label={isLiked ? "Unlike comment" : "Like comment"}
            className={clsx(s.likeButton, isLiked && s.likedButton)}
            type="button"
          >
            <Icon height={16} name={isLiked ? "heartFilled" : "heartOutline"} width={16} />
          </button>
        ) : null}
      </div>

      {showMetaActions && comment?.replies?.length ? (
        <div className={s.replies}>
          {comment.replies.map((reply) => (
            <CommentRow
              comment={reply}
              key={reply.id}
              showMetaActions={showMetaActions}
              variant={variant}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
