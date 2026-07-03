import { useInfiniteQuery } from "@tanstack/react-query"

import { USER_POSTS_PAGE_SIZE, USER_POSTS_QUERY_KEY } from "../model/constants"
import { userPostsApi } from "./userPostsApi"

export const useUserPostsInfiniteQuery = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [USER_POSTS_QUERY_KEY, userId],
    queryFn: ({ pageParam }) =>
      userPostsApi.getUserPosts(userId!, {
        cursor: pageParam,
        limit: USER_POSTS_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(userId),
  })
}
