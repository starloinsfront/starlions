import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const POST_ID_SEARCH_PARAM = "postId"
const HOME_POST_MODAL_ROUTE = "/post-modal"

export function proxy(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get(POST_ID_SEARCH_PARAM)?.trim()

  if (!postId) {
    return NextResponse.next()
  }

  const destination = request.nextUrl.clone()
  destination.pathname = `${HOME_POST_MODAL_ROUTE}/${encodeURIComponent(postId)}`

  return NextResponse.rewrite(destination)
}

export const config = {
  matcher: ["/"],
}
