import { getPostDetailData } from "@/features/posts/api/postsApi"
import { fetchPublicProfile } from "@/features/profile/api/usePublicProfileQuery"
import { userPostsApi } from "@/features/user-posts/api/userPostsApi"

import ProfilePageClient from "./ProfilePageClient"

type Props = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ postId?: string }>
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const [{ userId }, { postId }] = await Promise.all([params, searchParams])

  const [profile, posts, post] = await Promise.all([
    fetchPublicProfile(userId).catch(() => null),
    userPostsApi.getUserPosts(userId, { limit: 12 }).catch(() => null),
    postId ? getPostDetailData(postId) : Promise.resolve(null),
  ])

  return <ProfilePageClient initialPost={post} initialPosts={posts} initialProfile={profile} />
}
