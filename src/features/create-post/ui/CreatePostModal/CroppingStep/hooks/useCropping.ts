import { useState, useCallback, useRef, useEffect, type SyntheticEvent } from "react"
import { type Crop, type PercentCrop } from "react-image-crop"
import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"
import { generateCrop, loadImage, renderCropFromElement } from "./cropUtils"

export const useCropping = (photos: CreatePostPhoto[], activeIndex: number) => {
  const [isCropOptionsOpen, setIsCropOptionsOpen] = useState(false)
  const [aspectRatio, setAspectRatioState] = useState<number | null>(null)
  const [crop, setCropState] = useState<Crop | undefined>(undefined)

  // Per-photo crop storage keyed by photo id.
  const cropsRef = useRef<Record<string, PercentCrop | null>>({})
  const imgElementRef = useRef<HTMLImageElement | null>(null)
  const activePhoto = photos[activeIndex]
  const activePhotoId = activePhoto?.id

  // Derive selectedRatioId from aspectRatio
  const selectedRatioId =
    aspectRatio === null
      ? "original"
      : aspectRatio === 1
        ? "1-1"
        : aspectRatio === 0.8
          ? "4-5"
          : "16-9"

  /** Update crop state AND save to per-photo storage */
  const setCrop = useCallback(
    (newCrop: Crop | undefined) => {
      setCropState(newCrop)
      if (newCrop && newCrop.unit === "%" && activePhotoId) {
        cropsRef.current[activePhotoId] = newCrop as PercentCrop
      }
    },
    [activePhotoId],
  )

  // When the active photo changes, restore its saved crop.
  useEffect(() => {
    const savedCrop = activePhotoId ? cropsRef.current[activePhotoId] : null
    setCropState(savedCrop ?? undefined)
  }, [activePhotoId])

  // Toggle crop options menu
  const toggleCropOptions = useCallback(() => {
    setIsCropOptionsOpen((prev) => !prev)
  }, [])

  // Close crop options (called when gallery opens)
  const closeCropOptions = useCallback(() => {
    setIsCropOptionsOpen(false)
  }, [])

  // Set aspect ratio, close menu, and generate crop only for fixed ratios
  const setAspectRatio = useCallback(
    (ratio: number | null) => {
      setAspectRatioState(ratio)
      setIsCropOptionsOpen(false)

      if (ratio === null) {
        // "Original" — no crop overlay
        setCrop(undefined)
      } else if (imgElementRef.current) {
        // Fixed ratio — generate crop from current image natural dimensions
        const { naturalWidth, naturalHeight } = imgElementRef.current
        setCrop(generateCrop(naturalWidth, naturalHeight, ratio))
      }
    },
    [setCrop],
  )

  // Handle image load — save element ref and restore saved crop or generate new one
  const handleImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      imgElementRef.current = e.currentTarget

      // If this photo already has a saved crop, it will be restored by the
      // activePhotoId useEffect above. Only generate a new crop if:
      // 1. No saved crop for this photo AND
      // 2. A fixed ratio is selected
      const savedCrop = activePhotoId ? cropsRef.current[activePhotoId] : null
      if (!savedCrop && aspectRatio !== null) {
        const { naturalWidth, naturalHeight } = e.currentTarget
        setCrop(generateCrop(naturalWidth, naturalHeight, aspectRatio))
      }
    },
    [aspectRatio, activePhotoId, setCrop],
  )

  // Handle crop complete — save to per-photo storage
  const handleCropComplete = useCallback(
    (_: Crop, percentCrop: PercentCrop) => {
      if (activePhotoId) {
        cropsRef.current[activePhotoId] = percentCrop
      }
    },
    [activePhotoId],
  )

  // Confirm crop and generate cropped image via Canvas
  // Returns the cropped URL or null if no crop was applied
  const handleConfirmCrop = useCallback(async (): Promise<string | null> => {
    const percentCrop = activePhotoId ? cropsRef.current[activePhotoId] : null
    const imgElement = imgElementRef.current
    if (!percentCrop || !imgElement) return null

    const croppedUrl = await renderCropFromElement(imgElement, percentCrop)
    if (!croppedUrl) return null

    // Clear this photo's crop state (it's now baked into croppedImages)
    if (activePhotoId) {
      cropsRef.current[activePhotoId] = null
    }
    setCropState(undefined)
    setIsCropOptionsOpen(false)

    return croppedUrl
  }, [activePhotoId])

  /**
   * Batch-crop all photos using the current aspect ratio.
   * For the active photo, use its saved crop (if any).
   * For other photos: use saved crop if exists, otherwise generate centered crop.
   * Images that already have a cropped result (non-null in existingCropped)
   * are skipped to avoid redundant work.
   * Returns a new croppedImages array (same length as imageUrls).
   */
  const cropAllImages = useCallback(
    async (
      photosToCrop: CreatePostPhoto[],
      existingCropped: (string | null)[],
    ): Promise<(string | null)[]> => {
      const results = [...existingCropped]

      for (let i = 0; i < photosToCrop.length; i++) {
        if (existingCropped[i]) continue

        const photo = photosToCrop[i]
        const imgElement = await loadImage(photo.previewUrl)
        const { naturalWidth, naturalHeight } = imgElement

        // Use saved per-photo crop if exists, otherwise generate centered
        let percentCrop: PercentCrop = cropsRef.current[photo.id] ?? null as unknown as PercentCrop

        if (!cropsRef.current[photo.id]) {
          if (aspectRatio !== null) {
            percentCrop = generateCrop(naturalWidth, naturalHeight, aspectRatio)
          } else {
            // No aspect ratio — full image (0,0,100,100)
            percentCrop = { x: 0, y: 0, width: 100, height: 100, unit: "%" }
          }
        }

        const url = await renderCropFromElement(imgElement, percentCrop)
        results[i] = url
      }

      return results
    },
    [aspectRatio],
  )

  // Reset all crop state
  const resetCrop = useCallback(() => {
    setIsCropOptionsOpen(false)
    setAspectRatioState(null)
    setCropState(undefined)
    cropsRef.current = {}
    imgElementRef.current = null
  }, [])

  return {
    isCropOptionsOpen,
    aspectRatio,
    crop,
    selectedRatioId,
    toggleCropOptions,
    closeCropOptions,
    setAspectRatio,
    setCrop,
    handleImageLoad,
    handleCropComplete,
    handleConfirmCrop,
    cropAllImages,
    resetCrop,
  }
}
