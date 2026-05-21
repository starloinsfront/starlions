import s from "./PostDetail.module.css"
import { PostDetailAuthor, PostDetailComment } from "./PostDetail.types"

type Props = {
  author: PostDetailAuthor
  comments: PostDetailComment[]
  description: string
}

export const PostCommentsList = ({ author, comments, description }: Props) => {
  return (
    <div className={s.comments}>
      <div className={s.descriptionRow}>
        <span aria-hidden="true" className={s.avatar}>
          {author.avatar}
        </span>
        <div className={s.commentBody}>
          <p className={s.commentText}>
            <strong>{author.username}</strong>
            {description}
          </p>
          <span className={s.timestamp}>{comments[0]?.time ?? "2 hours ago"}</span>
        </div>
      </div>

      {comments.map(comment => (
        <div className={s.comment} key={comment.id}>
          <span aria-hidden="true" className={s.avatar}>
            {comment.avatar}
          </span>
          <div className={s.commentBody}>
            <p className={s.commentText}>
              <strong>{comment.username}</strong>
              {comment.text}
            </p>
            <span className={s.timestamp}>{comment.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
