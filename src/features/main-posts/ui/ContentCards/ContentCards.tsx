import type { PublicPost } from "@/features/posts/model/post.types"

import s from "./ContentCards.module.css"
import { MobilePostsFeed } from "./MobilePostsFeed/MobilePostsFeed"

type Props = {
  posts: PublicPost[]
  postHrefBase?: string
}

export const ContentCards = ({ posts, postHrefBase = "/" }: Props) => {
  return (
    <section aria-label="Latest public posts" className={s.section}>
      <MobilePostsFeed postHrefBase={postHrefBase} posts={posts} />
    </section>
  )
}
