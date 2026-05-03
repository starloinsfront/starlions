import s from "../ContentCards.module.css"

type Props = {
  avatar: string
  username: string
}

export const PostCardAuthor = ({ avatar, username }: Props) => {
  return (
    <div className={s.user}>
      <span aria-hidden="true" className={s.avatar}>
        {avatar}
      </span>

      <div className={s.userMeta}>
        <strong className={s.userName}>{username}</strong>
      </div>
    </div>
  )
}
