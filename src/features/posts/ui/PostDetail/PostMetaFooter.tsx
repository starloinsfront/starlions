import clsx from "clsx"

import { Icon } from "@/common/components/Icon/Icon"
import { formatPostDate } from "@/features/posts/lib/formatPostDate"
import { PostLikesAvatarStack } from "./PostLikesAvatarStack"
import s from "./PostMetaFooter.module.css"
import type { PostDetailLike } from "./PostDetail.types"

type Props = {
  className?: string
  commentsCount?: number
  createdAt: string
  isAuthorized: boolean
  likes: PostDetailLike[]
  likesCount: number
  onCommentsClick?: () => void
  onLikesClick?: () => void
  variant?: "desktop" | "mobile"
}

const formatMetric = (value: number) => new Intl.NumberFormat("ru-RU").format(value)

export const PostMetaFooter = ({
  className,
  commentsCount = 0,
  createdAt,
  isAuthorized,
  likes,
  likesCount,
  onCommentsClick,
  onLikesClick,
  variant = "desktop",
}: Props) => {
  const isMobile = variant === "mobile"

  return (
    <footer className={clsx(s.footer, isMobile && s.mobile, className)}>
      {isAuthorized && (
        <div aria-label="Post actions" className={s.actionsRow}>
          <div className={s.actionGroup}>
            <button aria-label="Like post" className={s.actionButton} type="button">
              <Icon height={24} name="heartOutline" width={24} />
            </button>
            {isMobile && (
              <button
                aria-label="Open comments"
                className={s.actionButton}
                onClick={onCommentsClick}
                type="button"
              >
                <Icon height={24} name="messageCircleOutline" width={24} />
              </button>
            )}
            <button aria-label="Share post" className={s.actionButton} type="button">
              <Icon height={24} name="paperPlaneOutline" width={24} />
            </button>
          </div>

          <button aria-label="Save post" className={s.actionButton} type="button">
            <Icon height={24} name="bookmarkOutline" width={24} />
          </button>
        </div>
      )}

      <div className={s.metaInfo}>
        <button className={s.likesButton} onClick={onLikesClick} type="button">
          <PostLikesAvatarStack likes={likes} />
          <span>{formatMetric(likesCount)} &quot;Like&quot;</span>
        </button>
        {!isMobile ? (
          <time className={s.date} dateTime={createdAt}>
            {formatPostDate(createdAt)}
          </time>
        ) : null}
      </div>

      {isMobile && commentsCount > 0 ? (
        <button className={s.viewCommentsButton} onClick={onCommentsClick} type="button">
          View all Comments ({commentsCount + 1})
        </button>
      ) : null}

      {isAuthorized && !isMobile && (
        <form className={s.commentForm} onSubmit={(event) => event.preventDefault()}>
          <input className={s.commentInput} placeholder="Add a Comment..." type="text" />
          <button className={s.publishButton} type="button">
            Publish
          </button>
        </form>
      )}
    </footer>
  )
}
