"use client"

import Link from "next/link"
import type { CSSProperties } from "react"
import { useState } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./ContentCards.module.css"

type PostImage = {
  background: string
  label: string
}

type Post = {
  avatar: string
  description: string
  id: number
  images: PostImage[]
  time: string
  username: string
}

const posts: Post[] = [
  {
    id: 1,
    username: "Olivia Mason",
    avatar: "OM",
    time: "22 min ago",
    description:
      "Golden hour frames, quiet coffee corners and a slow morning in a city that never really sleeps.",
    images: [
      { label: "Lisbon Rooftop", background: "linear-gradient(135deg, #615fff 0%, #1d1d1d 100%)" },
      { label: "Studio Notes", background: "linear-gradient(135deg, #397df6 0%, #0d0d0d 100%)" },
      { label: "Midnight Feed", background: "linear-gradient(135deg, #3e3e3e 0%, #111 100%)" },
    ],
  },
  {
    id: 2,
    username: "Daniel Reed",
    avatar: "DR",
    time: "1 hour ago",
    description:
      "A sharper profile card, a cleaner onboarding and the kind of contrast that keeps a dark UI feeling premium.",
    images: [
      { label: "Design Review", background: "linear-gradient(135deg, #0f1729 0%, #397df6 100%)" },
      { label: "UI Sprint", background: "linear-gradient(135deg, #332f55 0%, #090909 100%)" },
    ],
  },
  {
    id: 3,
    username: "Ava Brooks",
    avatar: "AB",
    time: "3 hours ago",
    description:
      "Testing carousel motion and content density on smaller screens before the next batch of creators joins.",
    images: [
      { label: "Night Motion", background: "linear-gradient(135deg, #111827 0%, #5b21b6 100%)" },
      { label: "Creator Mode", background: "linear-gradient(135deg, #0d0d0d 0%, #1d4ed8 100%)" },
      { label: "Preview Pass", background: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
    ],
  },
  {
    id: 4,
    username: "Ethan Cole",
    avatar: "EC",
    time: "5 hours ago",
    description:
      "Shipping another polished card layout with stronger hierarchy, tighter spacing and a calmer reading rhythm.",
    images: [
      { label: "Product Pulse", background: "linear-gradient(135deg, #397df6 0%, #56ccf2 100%)" },
      { label: "Evening Mode", background: "linear-gradient(135deg, #141e30 0%, #243b55 100%)" },
    ],
  },
]

const PostCard = ({ avatar, description, images, time, username }: Omit<Post, "id">) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = (index: number) => setActiveIndex(index)
  const showPrev = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const showNext = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return (
    <article className={s.card}>
      <div className={s.media}>
        <div
          className={s.slide}
          style={{ "--slide-background": images[activeIndex].background } as CSSProperties}
        >
          <span className={s.slideLabel}>{images[activeIndex].label}</span>
        </div>

        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              className={`${s.navButton} ${s.navPrev}`}
              onClick={showPrev}
              type="button"
            >
              <Icon height={18} name="arrowBackOutline" width={18} />
            </button>

            <button
              aria-label="Next image"
              className={`${s.navButton} ${s.navNext}`}
              onClick={showNext}
              type="button"
            >
              <Icon height={18} name="arrowForwardOutline" width={18} />
            </button>

            <div className={s.dots}>
              {images.map((image, index) => (
                <button
                  aria-current={activeIndex === index}
                  aria-label={`Open ${image.label}`}
                  className={s.dot}
                  key={image.label}
                  onClick={() => goToSlide(index)}
                  type="button"
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={s.content}>
        <div className={s.user}>
          <span aria-hidden="true" className={s.avatar}>
            {avatar}
          </span>

          <div className={s.userMeta}>
            <strong className={s.userName}>{username}</strong>
            <span className={s.time}>{time}</span>
          </div>
        </div>

        <p className={s.cardDescription}>
          {description}{" "}
          <Link className={s.showMore} href="/">
            Show more
          </Link>
        </p>
      </div>
    </article>
  )
}

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
