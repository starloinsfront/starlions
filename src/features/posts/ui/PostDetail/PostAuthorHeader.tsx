import clsx from "clsx"

import { getUserInitials } from "@/features/posts/lib/userInitials"
import { PostActionsMenu } from "./PostActionsMenu"
import { PostAvatar } from "./PostAvatar"
import s from "./PostAuthorHeader.module.css"
import { PostDetailAuthor } from "./PostDetail.types"

type Props = {
  author: PostDetailAuthor
  className?: string
  description: string
  isAuthorized: boolean
  isOwnPost: boolean
  onDescriptionUpdated?: (description: string) => void
  postId: string
}

export const PostAuthorHeader = ({
  author,
  className,
  description,
  isAuthorized,
  isOwnPost,
  onDescriptionUpdated,
  postId,
}: Props) => {
  return (
    <header className={clsx(s.header, className)}>
      <div className={s.authorInfo}>
        <PostAvatar label={getUserInitials(author.username)} size="md" />
        <span className={s.username}>{author.username}</span>
      </div>

      {isAuthorized && (
        <PostActionsMenu
          description={description}
          isOwnPost={isOwnPost}
          onDescriptionUpdated={onDescriptionUpdated}
          postId={postId}
        />
      )}
    </header>
  )
}
