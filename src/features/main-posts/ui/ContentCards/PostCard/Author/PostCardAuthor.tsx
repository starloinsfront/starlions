import { getUserInitials } from "@/features/posts/lib/userInitials"
import s from "./PostCardAuthor.module.css"

type Props = {
  username: string
}

export const PostCardAuthor = ({ username }: Props) => {
  return (
    <div className={s.user}>
      <span aria-hidden="true" className={s.avatar}>
        {getUserInitials(username)}
      </span>

      <div className={s.userMeta}>
        <strong className={s.userName}>{username}</strong>
      </div>
    </div>
  )
}
