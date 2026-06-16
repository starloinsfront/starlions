import { useMemo, useState, useCallback, useRef, useEffect } from "react"
import { useCarousel } from "@/common/components/Carousel/useCarousel"
import { CarouselNavigation } from "../CroppingStep/CarouselNavigation/CarouselNavigation"
import { PublicationStepHeader } from "./PublicationStepHeader/PublicationStepHeader"
import { usePublication } from "./hooks/usePublication"
import { FILTER_PRESETS } from "../FiltersStep/filters"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./PublicationStep.module.css"
import type { PublicationStepProps } from "./PublicationStep.types"

const MOCK_SUGGESTIONS = [
  { name: "New York", subName: "Manhattan, Times Square" },
  { name: "New York", subName: "Central Park" },
  { name: "New York", subName: "Brooklyn Bridge" },
  { name: "Los Angeles", subName: "Hollywood Walk of Fame" },
  { name: "Los Angeles", subName: "Santa Monica Pier" },
  { name: "London", subName: "Hyde Park" },
  { name: "London", subName: "Trafalgar Square" },
  { name: "Paris", subName: "Eiffel Tower" },
  { name: "Paris", subName: "Champs-Élysées" },
  { name: "Tokyo", subName: "Shibuya Crossing" },
  { name: "Tokyo", subName: "Shinjuku" },
  { name: "Berlin", subName: "Brandenburg Gate" },
  { name: "Rome", subName: "Colosseum" },
  { name: "Barcelona", subName: "La Sagrada Família" },
  { name: "Dubai", subName: "Burj Khalifa" },
  { name: "Sydney", subName: "Opera House" },
  { name: "Istanbul", subName: "Hagia Sophia" },
  { name: "Amsterdam", subName: "Dam Square" },
  { name: "Prague", subName: "Old Town Square" },
  { name: "Vienna", subName: "St. Stephen's Cathedral" },
  { name: "Miami", subName: "South Beach" },
  { name: "San Francisco", subName: "Golden Gate Bridge" },
  { name: "Chicago", subName: "Millennium Park" },
  { name: "Toronto", subName: "CN Tower" },
  { name: "Singapore", subName: "Marina Bay Sands" },
  { name: "Seoul", subName: "Gangnam District" },
  { name: "Bangkok", subName: "Grand Palace" },
  { name: "Lisbon", subName: "Belém Tower" },
  { name: "Athens", subName: "Acropolis" },
  { name: "Cairo", subName: "Pyramids of Giza" },
]

export const PublicationStep = ({
  selectedImages,
  croppedImages,
  selectedFilters,
  onBack,
  onPublish,
}: PublicationStepProps) => {
  const { activeIndex, goToSlide, showNext, showPrev } = useCarousel(selectedImages.length)
  const {
    description,
    location,
    maxDescriptionLength,
    handleDescriptionChange,
    handleLocationChange,
    selectLocation,
  } = usePublication()

  const [isPublishing, setIsPublishing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)

  const preparedPhotos = useMemo(
    () =>
      selectedImages.map((originalUrl, i) => ({
        displayImage: croppedImages[i] ?? originalUrl,
      })),
    [selectedImages, croppedImages],
  )

  const currentDisplayImage = preparedPhotos[activeIndex]?.displayImage

  /** Resolve the CSS filter string for the current photo. */
  const currentFilterCss = useMemo(() => {
    const filterId = selectedFilters[activeIndex]
    const preset = FILTER_PRESETS.find((f) => f.id === filterId)
    return preset?.value ?? "none"
  }, [selectedFilters, activeIndex])

  const filteredSuggestions = useMemo(() => {
    if (!location.trim()) return MOCK_SUGGESTIONS
    const query = location.toLowerCase()
    return MOCK_SUGGESTIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.subName.toLowerCase().includes(query),
    )
  }, [location])

  const handlePublishClick = useCallback(() => {
    setIsPublishing(true)
    onPublish({ description, location })
  }, [description, location, onPublish])

  const handleLocationFocus = useCallback(() => {
    setShowSuggestions(true)
  }, [])

  const handleSuggestionClick = useCallback(
    (name: string) => {
      selectLocation(name)
      setShowSuggestions(false)
    },
    [selectLocation],
  )

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={styles.step}>
      <PublicationStepHeader
        onBack={onBack}
        onPublish={handlePublishClick}
        isPublishing={isPublishing}
      />

      <div className={styles.content}>
        {/* ── Left: image carousel ── */}
        <div className={styles.carouselArea}>
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL cannot be used with next/image */}
          <img
            src={currentDisplayImage}
            alt={`Photo ${activeIndex + 1}`}
            className={styles.carouselImage}
            style={{ filter: currentFilterCss }}
          />

          <CarouselNavigation
            count={selectedImages.length}
            activeIndex={activeIndex}
            onPrev={showPrev}
            onNext={showNext}
            onGoToSlide={goToSlide}
          />
        </div>

        {/* ── Right: form panel ── */}
        <div className={styles.formPanel}>
          {/* Profile block */}
          <div className={styles.profileBlock}>
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder avatar */}
            <img
              src="/images/auth/email-confirm.svg"
              alt="User avatar"
              className={styles.avatar}
            />
            <span className={styles.username}>Username</span>
          </div>

          {/* Description field */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="pub-description">
              Add publication descriptions
            </label>
            <div className={styles.textareaWrapper}>
              <textarea
                id="pub-description"
                className={styles.textarea}
                placeholder="Text-area"
                value={description}
                onChange={handleDescriptionChange}
                maxLength={maxDescriptionLength}
              />
              <span className={styles.charCounter}>
                {description.length}/{maxDescriptionLength}
              </span>
            </div>
          </div>

          {/* Location field */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="pub-location">
              Add location
            </label>
            <div className={styles.locationWrapper} ref={locationRef}>
              <input
                id="pub-location"
                className={styles.locationInput}
                type="text"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
                onFocus={handleLocationFocus}
              />
              <Icon
                name="pinOutline"
                width={20}
                height={20}
                className={styles.pinIcon}
              />

              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <li key={`${suggestion.name}-${index}`}>
                      <button
                        type="button"
                        className={styles.suggestionItem}
                        onClick={() => handleSuggestionClick(suggestion.name)}
                      >
                        <span className={styles.suggestionName}>{suggestion.name}</span>
                        <span className={styles.suggestionSub}>{suggestion.subName}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
