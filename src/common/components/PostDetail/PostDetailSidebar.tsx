import s from "./PostDetail.module.css"
import { PostAuthorHeader } from "./PostAuthorHeader"
import { PostCommentsList } from "./PostCommentsList"
import { PostMetaFooter } from "./PostMetaFooter"
import { PostDetailData } from "./PostDetail.types"

type Props = {
  post: PostDetailData
}

export const PostDetailSidebar = ({ post }: Props) => {
  return (
    <aside className={s.sidebar}>
      <PostAuthorHeader author={post.author} />
      <PostCommentsList
        author={post.author}
        comments={post.comments}
        description={post.description}
      />
      <PostMetaFooter createdAt={post.createdAt} likes={post.likes} />
    </aside>
  )
}
