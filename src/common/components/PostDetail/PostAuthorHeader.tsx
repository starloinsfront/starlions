import s from "./PostDetail.module.css"
import { PostDetailAuthor } from "./PostDetail.types"

type Props = {
  author: PostDetailAuthor
}

export const PostAuthorHeader = ({ author }: Props) => {
  return (
    <header className={s.header}>
      <span aria-hidden="true" className={s.avatar}>
        {author.avatar}
      </span>
      <span className={s.username}>{author.username}</span>
    </header>
  )
}
