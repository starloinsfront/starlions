"use client"

import { useMemo, useState } from "react"
import { PostCardAuthor } from "./Author/PostCardAuthor"
import { PostCardDescription } from "./Description/PostCardDescription"
import { PostCardMedia } from "./Media/PostCardMedia"
import s from "./PostCard.module.css"
import type { PostCardProps } from "./PostCard.types"
import { formatRelativeTime } from "@/features/posts/lib/formatPostDate"

const DESCRIPTION_PREVIEW_LIMIT = 83

const getPreviewDescription = (description: string) => {
  if (description.length <= DESCRIPTION_PREVIEW_LIMIT) {
    return description
  }

  return `${description.slice(0, DESCRIPTION_PREVIEW_LIMIT).trimEnd()}...`
}

export const PostCard = ({
  author,
  description,
  id,
  images,
  createdAt,
  postHrefBase = "/",
}: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const canExpand = description.length > DESCRIPTION_PREVIEW_LIMIT
  const previewDescription = useMemo(() => getPreviewDescription(description), [description])
  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  return (
    <article className={`${s.card} ${isExpanded ? s.cardExpanded : ""}`}>
      <PostCardMedia
        hideControls={isExpanded}
        images={images}
        postHrefBase={postHrefBase}
        postId={id}
      />

      <div className={s.content}>
        <PostCardAuthor authorId={author.authorId} username={author.username} />
        <PostCardDescription
          canExpand={canExpand}
          description={description}
          isExpanded={isExpanded}
          onToggleAction={toggleExpanded}
          previewDescription={previewDescription}
          time={formatRelativeTime(createdAt)}
        />
      </div>
    </article>
  )
}
