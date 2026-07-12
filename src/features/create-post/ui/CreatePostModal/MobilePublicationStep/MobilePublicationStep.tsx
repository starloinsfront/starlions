import { useCallback, useMemo } from "react"
import { useMe } from "@/features/auth/api/useMe"
import { usePublication } from "../PublicationStep/hooks/usePublication"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import { DescriptionField } from "../PublicationStep/DescriptionField/DescriptionField"
import { LocationField } from "../PublicationStep/LocationField/LocationField"
import { MobilePublicationHeader } from "./MobilePublicationHeader"
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

  return (
    <div className={s.step}>
      <MobilePublicationHeader
        onBack={onBack}
        onPublish={handlePublishClick}
        isPublishing={isPublishing}
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

        <div className={s.formPanel}>
          <div className={s.profileBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder avatar */}
            <img
              src="/images/auth/email-confirm.svg"
              alt="User avatar"
              className={s.avatar}
            />
            <span className={s.username}>{me?.username}</span>
          </div>

          <DescriptionField
            description={description}
            maxDescriptionLength={maxDescriptionLength}
            onChange={handleDescriptionChange}
          />

          <LocationField
            location={location}
            onChange={handleLocationChange}
            onSelectLocation={selectLocation}
          />
        </div>
      </div>
    </div>
  )
}
