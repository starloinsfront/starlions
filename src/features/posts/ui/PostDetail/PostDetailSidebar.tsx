import s from "./PostDetailSidebar.module.css"
import { PostAuthorHeader } from "./PostAuthorHeader"
import { PostCommentsList } from "./PostCommentsList"
import { PostMetaFooter } from "./PostMetaFooter"
import { PostDetailData } from "./PostDetail.types"

type Props = {
  isAuthorized: boolean
  isOwnPost: boolean
  onOpenLikes?: () => void
  onDescriptionUpdated?: (description: string) => void
  post: PostDetailData
}

export const PostDetailSidebar = ({
  isAuthorized,
  isOwnPost,
  onOpenLikes,
  onDescriptionUpdated,
  post,
}: Props) => {
  return (
    <aside className={s.sidebar}>
      <PostAuthorHeader
        author={post.author}
        description={post.description}
        isAuthorized={isAuthorized}
        isOwnPost={isOwnPost}
        onDescriptionUpdated={onDescriptionUpdated}
        postId={post.id}
      />
      <PostCommentsList
        author={post.author}
        comments={post.comments}
        createdAt={post.createdAt}
        description={post.description}
        isAuthorized={isAuthorized}
      />
      <PostMetaFooter
        createdAt={post.createdAt}
        isAuthorized={isAuthorized}
        likes={post.likes}
        likesCount={post.likesCount}
        onLikesClick={onOpenLikes}
      />
    </aside>
  )
}
