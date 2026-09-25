import clsx from "clsx"

import { PostAvatar } from "./PostAvatar"
import s from "./PostLikesAvatarStack.module.css"
import type { PostDetailLike } from "./PostDetail.types"

type Props = {
  className?: string
  likes: PostDetailLike[]
}

export const PostLikesAvatarStack = ({ className, likes }: Props) => {
  const visibleLikes = likes.slice(0, 3)

  if (visibleLikes.length === 0) {
    return null
  }

  return (
    <span className={clsx(s.stack, className)}>
      {visibleLikes.map((like) => (
        <PostAvatar className={s.avatar} key={like.id} label={like.avatarLabel} size="sm" />
      ))}
    </span>
  )
}
