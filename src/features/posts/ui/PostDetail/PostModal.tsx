import { PostDetail } from "./PostDetail"
import { PostDetailModal } from "./PostDetailModal"
import type { PostDetailData } from "./PostDetail.types"
import { ROUTES } from "@/common/constants/route"

type Props = {
  closeHref: string
  post: PostDetailData
}

export const PostModal = ({ closeHref, post }: Props) => {
  return (
    <PostDetailModal closeHref={closeHref} mobileHref={ROUTES.postById(post.id)}>
      <PostDetail isModal key={post.id} post={post} />
    </PostDetailModal>
  )
}
