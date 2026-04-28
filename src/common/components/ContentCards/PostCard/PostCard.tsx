import { useState } from "react"
import s from "@/common/components/ContentCards/ContentCards.module.css"
import { PostCardAuthor } from "./PostCardAuthor"
import { PostCardDescription } from "./PostCardDescription"
import { PostCardMedia } from "./PostCardMedia"
import { PostCardProps } from "./PostCard.types"
import { usePostCarousel } from "./usePostCarousel"

export const PostCard = ({ avatar, description, id, images, time, username }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { activeIndex, goToSlide, showNext, showPrev } = usePostCarousel(images)
  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  return (
    <article className={`${s.card} ${isExpanded ? s.cardExpanded : ""}`}>
      <PostCardMedia
        activeIndex={activeIndex}
        goToSlide={goToSlide}
        images={images}
        postId={id}
        showNext={showNext}
        showPrev={showPrev}
      />

      <div className={s.content}>
        <PostCardAuthor avatar={avatar} username={username} />
        <PostCardDescription
          description={description}
          isExpanded={isExpanded}
          onToggle={toggleExpanded}
          time={time}
        />
      </div>
    </article>
  )
}
