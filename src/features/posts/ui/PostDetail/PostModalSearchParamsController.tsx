"use client"

import { useEffect, useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ROUTES } from "@/common/constants/route"
import {
  ACTION_SEARCH_PARAM,
  CREATE_POST_ACTION,
  POST_ID_SEARCH_PARAM,
} from "@/common/utils/modalSearchParams"
import { getPostDetailData } from "@/features/posts/api/postsApi"

import { PostDetail } from "./PostDetail"
import { PostDetailModal } from "./PostDetailModal"
import s from "./PostModalSearchParamsController.module.css"
import { PostDetailSkeleton } from "./PostDetailSkeleton/PostDetailSkeleton"

const POST_DETAIL_QUERY_KEY = "post-detail"

const buildHrefWithoutSearchParam = (
  pathname: string,
  searchParams: Pick<URLSearchParams, "toString">,
  omittedParam: string,
) => {
  const nextParams = new URLSearchParams(searchParams.toString())

  nextParams.delete(omittedParam)

  const query = nextParams.toString()

  return query ? `${pathname}?${query}` : pathname
}

export const PostModalSearchParamsController = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const postId = searchParams.get(POST_ID_SEARCH_PARAM)
  const createAction = searchParams.get(ACTION_SEARCH_PARAM)

  const closeHref = useMemo(() => {
    return buildHrefWithoutSearchParam(pathname, searchParams, POST_ID_SEARCH_PARAM)
  }, [pathname, searchParams])

  useEffect(() => {
    if (!postId || createAction !== CREATE_POST_ACTION) {
      return
    }

    const sanitizedHref = buildHrefWithoutSearchParam(pathname, searchParams, ACTION_SEARCH_PARAM)

    router.replace(sanitizedHref, { scroll: false })
  }, [createAction, pathname, postId, router, searchParams])

  const { data: post, isFetching } = useQuery({
    enabled: Boolean(postId),
    queryKey: [POST_DETAIL_QUERY_KEY, postId],
    queryFn: () => getPostDetailData(postId!),
    staleTime: 60_000,
  })

  if (!postId) {
    return null
  }

  if (isFetching && !post) {
    return (
      <PostDetailModal closeHref={closeHref} mobileHref={ROUTES.postById(postId)}>
        <PostDetailSkeleton />
      </PostDetailModal>
    )
  }

  if (!post) {
    return null
  }

  return (
    <PostDetailModal closeHref={closeHref} mobileHref={ROUTES.postById(post.id)}>
      <PostDetail isModal post={post} />
    </PostDetailModal>
  )
}
