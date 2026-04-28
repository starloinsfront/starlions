"use client"

import { useRouter } from "next/navigation"
import { Carousel } from "@/common/components/Carousel/Carousel"
import cardSliderStyles from "@/common/components/ContentCards/ContentCards.module.css"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./PostDetail.module.css"
import { PostDetailData } from "./PostDetail.types"

type Props = {
  post: PostDetailData
}

export const PostDetail = ({ post }: Props) => {
  const router = useRouter()

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push("/")
  }

  return (
    <section className={s.page}>
      <button
        aria-label="Close post details"
        className={s.closeButton}
        onClick={handleClose}
        type="button"
      >
        <Icon height={24} name="closeOutline" width={24} />
      </button>

      <article className={s.modal}>
        <div className={s.mediaSection}>
          <Carousel
            classNames={{
              dot: cardSliderStyles.dot,
              dots: cardSliderStyles.dots,
              navButton: cardSliderStyles.navButton,
              navNext: cardSliderStyles.navNext,
              navPrev: cardSliderStyles.navPrev,
              root: s.mediaCarousel,
              slide: s.mediaSlide,
            }}
            imageClassName={s.mediaImage}
            imageSizes="(max-width: 1024px) 100vw, 70vw"
            slides={post.images}
            variant="detail"
          />
        </div>

        <aside className={s.sidebar}>
          <header className={s.header}>
            <span aria-hidden="true" className={s.avatar}>
              {post.author.avatar}
            </span>
            <span className={s.username}>{post.author.username}</span>
          </header>

          <div className={s.comments}>
            <div className={s.descriptionRow}>
              <span aria-hidden="true" className={s.avatar}>
                {post.author.avatar}
              </span>
              <div className={s.commentBody}>
                <p className={s.commentText}>
                  <strong>{post.author.username}</strong>
                  {post.description}
                </p>
                <span className={s.timestamp}>{post.comments[0]?.time ?? "2 hours ago"}</span>
              </div>
            </div>

            {post.comments.map((comment) => (
              <div className={s.comment} key={comment.id}>
                <span aria-hidden="true" className={s.avatar}>
                  {comment.avatar}
                </span>
                <div className={s.commentBody}>
                  <p className={s.commentText}>
                    <strong>{comment.username}</strong>
                    {comment.text}
                  </p>
                  <span className={s.timestamp}>{comment.time}</span>
                </div>
              </div>
            ))}
          </div>

          <footer className={s.footer}>
            <p className={s.likes}>{post.likes.toLocaleString("en-US")} Like</p>
            <p className={s.date}>{post.createdAt}</p>
          </footer>
        </aside>
      </article>
    </section>
  )
}
