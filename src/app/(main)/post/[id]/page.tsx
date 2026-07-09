import { notFound } from "next/navigation"

import { getPostDetailData } from "@/features/posts/api/postsApi"
import { PostDetailPage } from "@/features/posts/ui/PostDetail/PostDetailPage"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const post = await getPostDetailData(id)

  if (!post) {
    notFound()
  }

  return <PostDetailPage post={post} />
}
