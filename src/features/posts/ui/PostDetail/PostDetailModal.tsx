import type { ReactNode } from "react"

import { PostModalCloseButton, PostModalControls } from "./PostModalControls"
import s from "./PostDetailModal.module.css"

type Props = {
  children: ReactNode
  closeHref?: string
  mobileHref?: string
}

export const PostDetailModal = ({ children, closeHref, mobileHref }: Props) => {
  return (
    <>
      <PostModalControls closeHref={closeHref} mobileHref={mobileHref} />
      <section
        aria-describedby="post-modal-description"
        aria-labelledby="post-modal-title"
        aria-modal="true"
        className={s.content}
        role="dialog"
      >
        <PostModalCloseButton closeHref={closeHref} />
        <h2 className={s.title} id="post-modal-title">
          Post details
        </h2>
        {children}
      </section>
    </>
  )
}
