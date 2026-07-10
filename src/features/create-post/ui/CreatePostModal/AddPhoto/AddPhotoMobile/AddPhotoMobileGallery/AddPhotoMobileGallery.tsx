import { useState, useCallback } from "react"
import { Icon } from "@/common/components/Icon/Icon"
import { useFileInput } from "@/common/hooks/useFileInput"
import { MAX_PHOTOS } from "@/features/create-post/model/useFileValidation"
import s from "./AddPhotoMobileGallery.module.css"
import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"

type AddPhotoMobileGalleryProps = {
  photos: CreatePostPhoto[]
  onSelectFiles: (files: File[]) => void
}

export const AddPhotoMobileGallery = ({
  photos,
  onSelectFiles,
}: AddPhotoMobileGalleryProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [previewId, setPreviewId] = useState<string | null>(null)

  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: onSelectFiles,
  })

  const toggleSelection = useCallback((photoId: string) => {
    setSelectedIds((prev) => {
      const index = prev.indexOf(photoId)
      if (index !== -1) {
        return prev.filter((id) => id !== photoId)
      }
      if (prev.length >= MAX_PHOTOS) return prev
      return [...prev, photoId]
    })
    setPreviewId(photoId)
  }, [])

  const previewPhoto = photos.find((p) => p.id === previewId)
  const layersIcon = selectedIds.length >= 2 ? "layersFilled" : "layersOutline"

  return (
    <div className={s.gallery}>
      {/* Block 1: Preview */}
      <div className={s.preview}>
        {previewPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob URL
          <img
            src={previewPhoto.previewUrl}
            alt="Selected preview"
            className={s.previewImage}
          />
        ) : (
          <div className={s.previewPlaceholder}>
            <Icon name="imageOutline" width={48} height={48} />
            <span className={s.previewPlaceholderText}>Select a photo</span>
          </div>
        )}
      </div>

      {/* Block 2: Gallery header */}
      <div className={s.galleryHeader}>
        <span className={s.galleryTitle}>My Gallery</span>
        <button
          className={s.galleryIconButton}
          type="button"
          aria-label="Add photos"
          onClick={triggerFileInput}
        >
          <Icon name={layersIcon} width={24} height={24} />
        </button>
      </div>

      {/* Block 3: Photo grid */}
      <div className={s.grid}>
        {photos.map((photo, index) => {
          const selectedIndex = selectedIds.indexOf(photo.id)
          const isSelected = selectedIndex !== -1

          return (
            <button
              key={photo.id}
              type="button"
              className={s.gridItem}
              onClick={() => toggleSelection(photo.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URL */}
              <img
                src={photo.previewUrl}
                alt={`Photo ${index + 1}`}
                className={s.gridImage}
              />
              <span
                className={`${s.selectionCircle} ${isSelected ? s.selectionCircleSelected : ""}`}
                role="button"
                tabIndex={0}
                aria-label={
                  isSelected
                    ? `Deselect photo ${selectedIndex + 1}`
                    : `Select photo ${index + 1}`
                }
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSelection(photo.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation()
                    e.preventDefault()
                    toggleSelection(photo.id)
                  }
                }}
              >
                {isSelected ? selectedIndex + 1 : ""}
              </span>
            </button>
          )
        })}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        className={s.hiddenInput}
        onChange={handleFileChange}
      />
    </div>
  )
}
