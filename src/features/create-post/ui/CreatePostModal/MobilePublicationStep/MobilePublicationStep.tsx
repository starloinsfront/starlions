import { useCallback, useMemo, useState } from "react"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
import { useMe } from "@/features/auth/api/useMe"
import { PublicationForm } from "../PublicationStep/PublicationForm"
import { PublicationStepHeader } from "../PublicationStep/PublicationStepHeader/PublicationStepHeader"
import { usePublication } from "../PublicationStep/hooks/usePublication"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import s from "./MobilePublicationStep.module.css"
import type { PublicationData } from "../PublicationStep/PublicationStep.types"

type MobilePublicationStepProps = {
  selectedImages: string[]
  croppedImages: (string | null)[]
  selectedFilters: (string | null)[]
  onBack: () => void
  onPublish: (data: PublicationData) => void
  isPublishing?: boolean
}

const VISIBLE_COUNT = 3

export const MobilePublicationStep = ({
  selectedImages,
  croppedImages,
  selectedFilters,
  onBack,
  onPublish,
  isPublishing = false,
}: MobilePublicationStepProps) => {
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false)
  const { data: me } = useMe()
  const {
    description,
    location,
    maxDescriptionLength,
    handleDescriptionChange,
    handleLocationChange,
    selectLocation,
  } = usePublication()

  const displayPhotos = useMemo(
    () =>
      selectedImages.map((originalUrl, i) => ({
        src: croppedImages[i] ?? originalUrl,
        filterCss: FILTER_PRESETS.find((f) => f.id === selectedFilters[i])?.value ?? "none",
      })),
    [selectedImages, croppedImages, selectedFilters],
  )

  const visiblePhotos = displayPhotos.slice(0, VISIBLE_COUNT)
  const overflowCount = Math.max(0, displayPhotos.length - VISIBLE_COUNT)

  const handlePublishClick = useCallback(() => {
    onPublish({ description, location })
  }, [description, location, onPublish])

  const hasContent = description.trim().length > 0 || location.trim().length > 0

  const handleBack = useCallback(() => {
    if (hasContent) {
      setIsDiscardDialogOpen(true)
      return
    }
    onBack()
  }, [hasContent, onBack])

  const handleDiscard = useCallback(() => {
    setIsDiscardDialogOpen(false)
    onBack()
  }, [onBack])

  return (
    <div className={s.step}>
      <PublicationStepHeader
        onBack={handleBack}
        onPublish={handlePublishClick}
        isPublishing={isPublishing}
        variant="mobile"
      />

      <div className={s.content}>
        <div className={s.imageArea}>
          <div className={s.imageStrip}>
            {visiblePhotos.map((photo, i) => (
              <div key={i} className={s.imageSlot}>
                {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
                <img
                  src={photo.src}
                  alt={`Photo ${i + 1}`}
                  className={s.stripImage}
                  style={{ filter: photo.filterCss }}
                />
              </div>
            ))}
            {overflowCount > 0 && (
              <div className={s.overflowOverlay}>
                <span className={s.overflowCount}>+{overflowCount}</span>
              </div>
            )}
          </div>
        </div>

        <PublicationForm
          className={s.formPanel}
          description={description}
          location={location}
          maxDescriptionLength={maxDescriptionLength}
          onDescriptionChange={handleDescriptionChange}
          onLocationChange={handleLocationChange}
          onSelectLocation={selectLocation}
          username={me?.username}
        />
      </div>

      <ConfirmationModal
        isOpen={isDiscardDialogOpen}
        title="Discard post?"
        message="Your description and location will be lost."
        discardBtnText="Discard"
        confirmBtnText="Keep editing"
        onDiscard={handleDiscard}
        onConfirm={() => setIsDiscardDialogOpen(false)}
        onClose={() => setIsDiscardDialogOpen(false)}
      />
    </div>
  )
}
