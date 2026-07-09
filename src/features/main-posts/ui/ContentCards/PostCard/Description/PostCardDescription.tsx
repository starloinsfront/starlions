"use client"

import clsx from "clsx"

import stylesPostCard from "../PostCard.module.css"
import s from "./PostCardDescription.module.css"

type Props = {
  canExpand: boolean
  description: string
  isExpanded: boolean
  onToggle: () => void
  previewDescription: string
  time: string
}

export const PostCardDescription = ({
  canExpand,
  description,
  isExpanded,
  onToggle,
  previewDescription,
  time,
}: Props) => {
  const visibleDescription = isExpanded ? description : previewDescription
  const toggleLabel = isExpanded ? "Hide" : "Show more"

  return (
    <div className={s.cardMeta}>
      <span className={s.time}>{time}</span>

      <div
        className={clsx(
          s.descriptionViewport,
          canExpand &&
            (isExpanded ? s.descriptionViewportExpanded : s.descriptionViewportCollapsed),
        )}
      >
        <p className={stylesPostCard.descriptionText}>
          {visibleDescription}{" "}
          {canExpand && (
            <>
              <button
                aria-expanded={isExpanded}
                className={s.showMore}
                onClick={onToggle}
                type="button"
              >
                {toggleLabel}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
