"use client"

import { useRouter } from "next/navigation"
import { PostDetailCloseButton } from "./PostDetailCloseButton"
import { PostDetailMedia } from "./PostDetailMedia"
import { PostDetailSidebar } from "./PostDetailSidebar"
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
      <PostDetailCloseButton onClose={handleClose} />

      <article className={s.modal}>
        <PostDetailMedia images={post.images} />
        <PostDetailSidebar post={post} />
      </article>
    </section>
  )
}
