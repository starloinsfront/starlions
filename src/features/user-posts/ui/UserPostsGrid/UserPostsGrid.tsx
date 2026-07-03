"use client"

import { useCallback } from "react"

import { Loader } from "@/common/components/Loader/Loader"
import { useIntersectionObserver } from "@/common/hooks/useIntersectionObserver"
import { useUserPostsInfiniteQuery } from "@/features/user-posts/api/useUserPostsInfiniteQuery"

import { UserPostTile } from "./UserPostTile"
import s from "./UserPostsGrid.module.css"

type Props = {
  userId: string
}

export const UserPostsGrid = ({ userId }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useUserPostsInfiniteQuery(userId)

  const posts = data?.pages.flatMap((page) => page.items) ?? []

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const sentinelRef = useIntersectionObserver(loadMore, {
    enabled: Boolean(hasNextPage),
  })

  if (isLoading) {
    return (
      <div className={s.state}>
        <Loader />
      </div>
    )
  }

  if (isError) {
    return <p className={s.state}>Failed to load publications.</p>
  }

  if (posts.length === 0) {
    return <p className={s.state}>No publications yet.</p>
  }

  return (
    <section className={s.section}>
      <div className={s.grid}>
        {posts.map((post) => (
          <UserPostTile
            key={post.id}
            coverUrl={post.coverUrl}
            id={post.id}
            imagesCount={post.imagesCount}
          />
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden className={s.sentinel} />
      {isFetchingNextPage && (
        <div className={s.loader}>
          <Loader />
        </div>
      )}
    </section>
  )
}
