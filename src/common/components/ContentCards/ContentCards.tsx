"use client"

import s from "./ContentCards.module.css"
import { posts } from "@/common/components/ContentCards/PostsMockData"
import { PostCard } from "@/common/components/ContentCards/PostCard"

export const ContentCards = () => {
  return (
    <section className={s.section}>
      <div className={s.grid}>
        {posts.map(({ id, ...post }) => (
          <PostCard key={id} {...post} />
        ))}
      </div>
    </section>
  )
}
