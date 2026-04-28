import { notFound } from "next/navigation"
import { PostDetail } from "@/common/components/PostDetail/PostDetail"
import { getPostDetailById } from "@/common/components/PostDetail/PostDetail.data"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const postId = Number(id)

  if (!Number.isInteger(postId)) {
    notFound()
  }

  const post = getPostDetailById(postId)

  if (!post) {
    notFound()
  }

  return <PostDetail post={post} />
}
