import Link from "next/link"

import { ROUTES } from "@/common/constants/route"
import { getUserInitials } from "@/features/posts/lib/userInitials"
import { PostAvatar } from "@/features/posts/ui/PostDetail/PostAvatar"

import s from "./PostCardAuthor.module.css"

type Props = {
  authorId: string
  avatarUrl?: string | null
  username: string
}

export const PostCardAuthor = ({ authorId, avatarUrl, username }: Props) => {
  return (
    <Link
      aria-label={`Open ${username} profile`}
      className={s.user}
      href={ROUTES.profileById(authorId)}
      prefetch={false}
    >
      <PostAvatar imageUrl={avatarUrl} label={getUserInitials(username)} size="md" />

      <span className={s.userMeta}>
        <strong className={s.userName}>{username}</strong>
      </span>
    </Link>
  )
}
