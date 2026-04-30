import s from "./PostDetail.module.css"

type Props = {
  createdAt: string
  likes: number
}

export const PostMetaFooter = ({ createdAt, likes }: Props) => {
  return (
    <footer className={s.footer}>
      <p className={s.likes}>{likes.toLocaleString("en-US")} Like</p>
      <p className={s.date}>{createdAt}</p>
    </footer>
  )
}
