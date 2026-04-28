import { useState } from "react"
import s from "@/common/components/ContentCards/ContentCards.module.css"
import { PostCardAuthor } from "./PostCardAuthor"
import { PostCardDescription } from "./PostCardDescription"
import { PostCardMedia } from "./PostCardMedia"
import { PostCardProps } from "./PostCard.types"

export const PostCard = ({ avatar, description, id, images, time, username }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  return (
    <article className={`${s.card} ${isExpanded ? s.cardExpanded : ""}`}>
      <PostCardMedia images={images} postId={id} />

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
