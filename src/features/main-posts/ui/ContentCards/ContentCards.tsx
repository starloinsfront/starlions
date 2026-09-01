import type { PublicPost } from "@/features/posts/model/post.types"

import s from "./ContentCards.module.css"
import { MobilePostsFeed } from "./MobilePostsFeed/MobilePostsFeed"
import { PostCard } from "./PostCard/PostCard"

type Props = {
  posts: PublicPost[]
  postHrefBase?: string
}

export const ContentCards = ({ posts, postHrefBase = "/" }: Props) => {
  return (
    <section aria-label="Latest public posts" className={s.section}>
      <div className={s.desktopGrid}>
        {posts.map((post) => (
          <PostCard key={post.id} {...post} postHrefBase={postHrefBase} />
        ))}
      </div>

      <div className={s.mobileFeed}>
        <MobilePostsFeed posts={posts} />
      </div>
    </section>
  )
}
