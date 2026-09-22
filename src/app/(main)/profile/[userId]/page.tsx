import { notFound } from "next/navigation"

import { isApiError } from "@/common/utils/api/error/apiError"
import { buildPostModalCloseHref, POST_ID_SEARCH_PARAM } from "@/common/utils/modalSearchParams"
import { getFirstSearchParamValue, type SearchParamsRecord } from "@/common/utils/urlSearchParams"
import { getPostDetailData } from "@/features/posts/api/postsApi"
import { PostModal } from "@/features/posts/ui/PostDetail/PostModal"
import { fetchPublicProfile } from "@/features/profile/api/profileApi"
import { USER_POSTS_PAGE_SIZE } from "@/features/user-posts/model/constants"
import { userPostsApi } from "@/features/user-posts/api/userPostsApi"

import { ProfilePageClient } from "./ProfilePageClient"

type Props = {
  params: Promise<{ userId: string }>
  searchParams: Promise<SearchParamsRecord>
}

const loadProfilePageData = async (userId: string, postId?: string) => {
  try {
    const [profile, initialPosts, selectedPost] = await Promise.all([
      fetchPublicProfile(userId),
      userPostsApi.getUserPosts(userId, { limit: USER_POSTS_PAGE_SIZE }),
      postId ? getPostDetailData(postId) : Promise.resolve(null),
    ])

    if (postId && !selectedPost) {
      notFound()
    }

    return { initialPosts, profile, selectedPost }
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      notFound()
    }

    throw error
  }
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const [{ userId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const postId = getFirstSearchParamValue(resolvedSearchParams, POST_ID_SEARCH_PARAM)
  const { initialPosts, profile, selectedPost } = await loadProfilePageData(userId, postId)
  const closeHref = buildPostModalCloseHref(
    `/profile/${encodeURIComponent(userId)}`,
    resolvedSearchParams,
  )

  return (
    <>
      <ProfilePageClient initialPosts={initialPosts} profile={profile} userId={userId} />
      {selectedPost ? <PostModal closeHref={closeHref} post={selectedPost} /> : null}
    </>
  )
}
