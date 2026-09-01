import Link from "next/link"

import { ROUTES } from "@/common/constants/route"
import { getUserInitials } from "@/features/posts/lib/userInitials"

import s from "./PostCardAuthor.module.css"

type Props = {
  authorId: string
  username: string
}

export const PostCardAuthor = ({ authorId, username }: Props) => {
  return (
    <Link
      aria-label={`Open ${username} profile`}
      className={s.user}
      href={ROUTES.profileById(authorId)}
    >
      <span aria-hidden="true" className={s.avatar}>
        {getUserInitials(username)}
      </span>

      <span className={s.userMeta}>
        <strong className={s.userName}>{username}</strong>
      </span>
    </Link>
  )
}
