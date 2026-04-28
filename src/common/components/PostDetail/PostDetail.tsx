"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./PostDetail.module.css"
import { PostDetailData } from "./PostDetail.types"

type Props = {
  post: PostDetailData
}

export const PostDetail = ({ post }: Props) => {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)

  const showPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))
  }

  const showNext = () => {
    setActiveIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))
  }

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
          {/*todo: сделать 1 слайдер. маленьуий - уже готовый (стили)*/}
          <div className={s.mediaFrame}>
            <Image
              alt={post.images[activeIndex].label}
              className={s.mediaImage}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
              src={post.images[activeIndex].src}
            />
          </div>

          {post.images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                className={`${s.mediaArrow} ${s.mediaArrowPrev}`}
                onClick={showPrev}
                type="button"
              >
                <Icon
                  className={s.mediaArrowIconLeft}
                  height={24}
                  name="arrowIosDownOutline"
                  width={24}
                />
              </button>

              <button
                aria-label="Next image"
                className={`${s.mediaArrow} ${s.mediaArrowNext}`}
                onClick={showNext}
                type="button"
              >
                <Icon
                  className={s.mediaArrowIconRight}
                  height={24}
                  name="arrowIosDownOutline"
                  width={24}
                />
              </button>

              <div className={s.mediaDots}>
                {post.images.map((image, index) => (
                  <button
                    aria-current={activeIndex === index}
                    aria-label={`Open ${image.label}`}
                    className={s.mediaDot}
                    key={image.id}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            </>
          )}
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
