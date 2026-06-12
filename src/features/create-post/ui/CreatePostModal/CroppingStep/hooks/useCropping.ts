import { useState, useCallback, useRef, useEffect, type SyntheticEvent } from "react"
import {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PercentCrop,
  type PixelCrop,
} from "react-image-crop"

/** Generate a centered crop for a given aspect ratio and image dimensions */
function generateCrop(width: number, height: number, ratio: number): PercentCrop {
  const crop = centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, ratio, width, height),
    width,
    height,
  )
  return {
    x: crop.x as number,
    y: crop.y as number,
    width: crop.width as number,
    height: crop.height as number,
    unit: "%",
  }
}

/** Load an image URL into an off-screen HTMLImageElement and resolve when ready. */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Render a crop region from an already-loaded image element onto a canvas
 * and return the result as a JPEG blob URL.
 */
async function renderCropFromElement(
  imgElement: HTMLImageElement,
  percentCrop: PercentCrop,
): Promise<string | null> {
  // IMPORTANT: Use naturalWidth/naturalHeight (actual image file size)
  // because drawImage works with the natural image, not CSS display size
  const { naturalWidth, naturalHeight } = imgElement
  const pixelCrop: PixelCrop = {
    x: (percentCrop.x / 100) * naturalWidth,
    y: (percentCrop.y / 100) * naturalHeight,
    width: (percentCrop.width / 100) * naturalWidth,
    height: (percentCrop.height / 100) * naturalHeight,
    unit: "px",
  }

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    imgElement,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.95),
  )
  if (!blob) return null

  return URL.createObjectURL(blob)
}

export const useCropping = (activeIndex: number, photosCount: number) => {
  const [isCropOptionsOpen, setIsCropOptionsOpen] = useState(false)
  const [aspectRatio, setAspectRatioState] = useState<number | null>(null)
  const [crop, setCropState] = useState<Crop | undefined>(undefined)

  // Per-photo crop storage: one PercentCrop per photo (null = no crop set)
  const cropsRef = useRef<(PercentCrop | null)[]>(Array(photosCount).fill(null))
  const imgElementRef = useRef<HTMLImageElement | null>(null)

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
      if (newCrop && newCrop.unit === "%") {
        cropsRef.current[activeIndex] = newCrop as PercentCrop
      }
    },
    [activeIndex],
  )

  // When activeIndex changes, restore the saved crop for the new photo
  useEffect(() => {
    const savedCrop = cropsRef.current[activeIndex]
    setCropState(savedCrop ?? undefined)
  }, [activeIndex])

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
      // activeIndex useEffect above. Only generate a new crop if:
      // 1. No saved crop for this photo AND
      // 2. A fixed ratio is selected
      const savedCrop = cropsRef.current[activeIndex]
      if (!savedCrop && aspectRatio !== null) {
        const { naturalWidth, naturalHeight } = e.currentTarget
        setCrop(generateCrop(naturalWidth, naturalHeight, aspectRatio))
      }
    },
    [aspectRatio, activeIndex, setCrop],
  )

  // Handle crop complete — save to per-photo storage
  const handleCropComplete = useCallback(
    (_: Crop, percentCrop: PercentCrop) => {
      cropsRef.current[activeIndex] = percentCrop
    },
    [activeIndex],
  )

  // Confirm crop and generate cropped image via Canvas
  // Returns the cropped URL or null if no crop was applied
  const handleConfirmCrop = useCallback(async (): Promise<string | null> => {
    const percentCrop = cropsRef.current[activeIndex]
    const imgElement = imgElementRef.current
    if (!percentCrop || !imgElement) return null

    const croppedUrl = await renderCropFromElement(imgElement, percentCrop)
    if (!croppedUrl) return null

    // Clear this photo's crop state (it's now baked into croppedImages)
    cropsRef.current[activeIndex] = null
    setCropState(undefined)
    setIsCropOptionsOpen(false)

    return croppedUrl
  }, [activeIndex])

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
      imageUrls: string[],
      existingCropped: (string | null)[],
    ): Promise<(string | null)[]> => {
      const results = [...existingCropped]

      for (let i = 0; i < imageUrls.length; i++) {
        if (existingCropped[i]) continue

        const imgElement = await loadImage(imageUrls[i])
        const { naturalWidth, naturalHeight } = imgElement

        // Use saved per-photo crop if exists, otherwise generate centered
        let percentCrop: PercentCrop = cropsRef.current[i] ?? null as unknown as PercentCrop

        if (!cropsRef.current[i]) {
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
    cropsRef.current = cropsRef.current.map(() => null)
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
