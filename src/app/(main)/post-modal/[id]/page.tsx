import { notFound } from "next/navigation"

import { getMainPageData } from "@/features/main-posts/api/postsApi"
import { getPostDetailData } from "@/features/posts/api/postsApi"
import { PostModal } from "@/features/posts/ui/PostDetail/PostModal"
import { Main } from "@/widgets/Main/Main"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function HomePostModalPage({ params }: Props) {
  const { id } = await params
  const [data, post] = await Promise.all([getMainPageData(), getPostDetailData(id)])

  if (!post) {
    notFound()
  }

  return (
    <>
      <Main data={data} postHrefBase="/" />
      <PostModal closeHref="/" post={post} />
    </>
  )
}
