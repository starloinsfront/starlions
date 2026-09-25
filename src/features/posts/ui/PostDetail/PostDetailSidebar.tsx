import s from "./PostDetailSidebar.module.css"
import { PostAuthorHeader } from "./PostAuthorHeader"
import { PostCommentsList } from "./PostCommentsList"
import { PostMetaFooter } from "./PostMetaFooter"
import { PostDetailData } from "./PostDetail.types"

type Props = {
  isAuthorized: boolean
  isFollowing: boolean
  isOwnPost: boolean
  onFollowToggle: () => void
  onOpenLikes?: () => void
  onDescriptionUpdated?: (description: string) => void
  post: PostDetailData
}

export const PostDetailSidebar = ({
  isAuthorized,
  isFollowing,
  isOwnPost,
  onFollowToggle,
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
        isFollowing={isFollowing}
        isOwnPost={isOwnPost}
        onDescriptionUpdated={onDescriptionUpdated}
        onFollowToggle={onFollowToggle}
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
        interactionsAvailable={post.interactionsAvailable}
        isAuthorized={isAuthorized}
        likes={post.likes}
        likesCount={post.likesCount}
        onLikesClick={onOpenLikes}
      />
    </aside>
  )
}
