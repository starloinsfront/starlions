import { PostDetail } from "./PostDetail"
import s from "./PostDetailPage.module.css"
import { PostDetailData } from "./PostDetail.types"

type Props = {
  post: PostDetailData
}

export const PostDetailPage = ({ post }: Props) => {
  return (
    <section className={s.page}>
      <PostDetail post={post} />
    </section>
  )
}
