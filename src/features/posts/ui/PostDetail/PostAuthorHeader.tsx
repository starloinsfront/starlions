import clsx from "clsx"
import Link from "next/link"

import { ROUTES } from "@/common/constants/route"
import { getUserInitials } from "@/features/posts/lib/userInitials"

import { PostActionsMenu } from "./PostActionsMenu"
import { PostAvatar } from "./PostAvatar"
import type { PostDetailAuthor } from "./PostDetail.types"
import s from "./PostAuthorHeader.module.css"

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
      <Link
        aria-label={`Open ${author.username} profile`}
        className={s.authorInfo}
        href={ROUTES.profileById(author.authorId)}
      >
        <PostAvatar label={getUserInitials(author.username)} size="md" />
        <span className={s.username}>{author.username}</span>
      </Link>

      {isAuthorized ? (
        <PostActionsMenu
          description={description}
          isOwnPost={isOwnPost}
          onDescriptionUpdated={onDescriptionUpdated}
          postId={postId}
        />
      ) : null}
    </header>
  )
}
