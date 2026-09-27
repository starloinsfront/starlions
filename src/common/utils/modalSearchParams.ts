import {
  buildPathWithSearchParams,
  getFirstSearchParamValue,
  type SearchParamsRecord,
} from "./urlSearchParams"

export const POST_ID_SEARCH_PARAM = "postId"
export const ACTION_SEARCH_PARAM = "action"
export const CREATE_POST_ACTION = "create"

export const getPostIdFromSearchParams = (searchParams: SearchParamsRecord) => {
  return getFirstSearchParamValue(searchParams, POST_ID_SEARCH_PARAM)
}

export const isCreatePostAction = (searchParams: SearchParamsRecord) => {
  return getFirstSearchParamValue(searchParams, ACTION_SEARCH_PARAM) === CREATE_POST_ACTION
}

export const buildPostModalHref = (pathname: string, postId: string) => {
  return buildPathWithSearchParams(pathname, {
    [POST_ID_SEARCH_PARAM]: postId,
  })
}

export const buildCreatePostModalHref = (pathname: string) => {
  return buildPathWithSearchParams(pathname, {
    [ACTION_SEARCH_PARAM]: CREATE_POST_ACTION,
  })
}

export const buildPostModalCloseHref = (
  pathname: string,
  searchParams: SearchParamsRecord,
) => {
  return buildPathWithSearchParams(pathname, searchParams, [POST_ID_SEARCH_PARAM])
}

export const getSanitizedModalUrl = (
  pathname: string,
  searchParams: SearchParamsRecord,
) => {
  const postId = getPostIdFromSearchParams(searchParams)

  if (!postId || !isCreatePostAction(searchParams)) {
    return null
  }

  return buildPathWithSearchParams(pathname, searchParams, [ACTION_SEARCH_PARAM])
}
