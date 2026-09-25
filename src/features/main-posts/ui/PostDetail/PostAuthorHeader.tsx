import clsx from "clsx"

import { getUserInitials } from "@/features/main-posts/lib/userInitials"
import { PostActionsMenu } from "./PostActionsMenu"
import { PostAvatar } from "./PostAvatar"
import s from "./PostAuthorHeader.module.css"
import { PostDetailAuthor } from "./PostDetail.types"

type Props = {
  author: PostDetailAuthor
  className?: string
  isAuthorized: boolean
  isOwnPost: boolean
}

export const PostAuthorHeader = ({ author, className, isAuthorized, isOwnPost }: Props) => {
  return (
    <header className={clsx(s.header, className)}>
      <div className={s.authorInfo}>
        <PostAvatar label={getUserInitials(author.username)} size="md" />
        <span className={s.username}>{author.username}</span>
      </div>

      {isAuthorized && <PostActionsMenu isOwnPost={isOwnPost} />}
    </header>
  )
}
