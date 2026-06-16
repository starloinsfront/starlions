import type { RefObject } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./MiniGallery.module.css"

type MiniGalleryProps = {
  images: string[]
  activeIndex: number
  onSelectSlide: (index: number) => void
  onRemoveImage: (index: number) => void
  onAddClick: () => void
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const MiniGallery = ({
  images,
  activeIndex,
  onSelectSlide,
  onRemoveImage,
  onAddClick,
  fileInputRef,
  onFileChange,
}: MiniGalleryProps) => {
  return (
    <div className={styles.galleryPanel}>
      <div className={styles.galleryList}>
        {images.map((url, index) => (
          <button
            key={url}
            type="button"
            className={`${styles.thumbnail} ${activeIndex === index ? styles.thumbnailActive : ""}`}
            onClick={() => onSelectSlide(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
            <img
              src={url}
              alt={`Thumbnail ${index + 1}`}
              className={styles.thumbnailImage}
            />
            <span
              className={styles.thumbnailRemove}
              role="button"
              tabIndex={0}
              aria-label={`Remove image ${index + 1}`}
              onClick={(e) => {
                e.stopPropagation()
                onRemoveImage(index)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                  e.preventDefault()
                  onRemoveImage(index)
                }
              }}
            >
              <Icon name="closeOutline" width={12} height={12} />
            </span>
          </button>
        ))}

        {/* Add button */}
        <button
          className={styles.addButton}
          type="button"
          aria-label="Add image"
          onClick={onAddClick}
        >
          <Icon name="plusCircleOutline" width={24} height={24} />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        hidden
        onChange={onFileChange}
      />
    </div>
  )
}
