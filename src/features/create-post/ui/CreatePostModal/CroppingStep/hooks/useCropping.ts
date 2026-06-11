import { useState, useCallback, useRef, type SyntheticEvent } from "react"
import {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PercentCrop,
  type PixelCrop,
} from "react-image-crop"

type UseCroppingOptions = {
  onCropConfirm: (croppedImageUrl: string, index: number) => void
}

/** Generate a centered crop for a given aspect ratio and image dimensions */
function generateCrop(width: number, height: number, ratio: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, ratio, width, height),
    width,
    height,
  )
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
  const { width, height } = imgElement
  const pixelCrop: PixelCrop = {
    x: (percentCrop.x / 100) * width,
    y: (percentCrop.y / 100) * height,
    width: (percentCrop.width / 100) * width,
    height: (percentCrop.height / 100) * height,
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

export const useCropping = ({ onCropConfirm }: UseCroppingOptions) => {
  const [isCropOptionsOpen, setIsCropOptionsOpen] = useState(false)
  const [aspectRatio, setAspectRatioState] = useState<number | null>(null)
  const [crop, setCrop] = useState<Crop | undefined>(undefined)

  // Store image element ref for crop generation when ratio is selected
  const imgElementRef = useRef<HTMLImageElement | null>(null)
  const completedCropRef = useRef<PercentCrop | null>(null)

  // Derive selectedRatioId from aspectRatio
  const selectedRatioId =
    aspectRatio === null
      ? "original"
      : aspectRatio === 1
        ? "1-1"
        : aspectRatio === 0.8
          ? "4-5"
          : "16-9"

  // Toggle crop options menu
  const toggleCropOptions = useCallback(() => {
    setIsCropOptionsOpen((prev) => !prev)
  }, [])

  // Close crop options (called when gallery opens)
  const closeCropOptions = useCallback(() => {
    setIsCropOptionsOpen(false)
  }, [])

  // Set aspect ratio, close menu, and generate crop only for fixed ratios
  const setAspectRatio = useCallback((ratio: number | null) => {
    setAspectRatioState(ratio)
    setIsCropOptionsOpen(false)

    if (ratio === null) {
      // "Original" — no crop overlay
      setCrop(undefined)
      completedCropRef.current = null
    } else if (imgElementRef.current) {
      // Fixed ratio — generate crop from current image dimensions
      const { width, height } = imgElementRef.current
      setCrop(generateCrop(width, height, ratio))
    }
  }, [])

  // Handle image load — save element ref only, do NOT create crop
  const handleImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      imgElementRef.current = e.currentTarget

      // If a fixed ratio is already selected, re-generate crop for the new image
      if (aspectRatio !== null) {
        const { width, height } = e.currentTarget
        setCrop(generateCrop(width, height, aspectRatio))
      }
    },
    [aspectRatio],
  )

  // Handle crop complete
  const handleCropComplete = useCallback((_: Crop, percentCrop: PercentCrop) => {
    completedCropRef.current = percentCrop
  }, [])

  // Confirm crop and generate cropped image via Canvas
  const handleConfirmCrop = useCallback(
    async (imageIndex: number) => {
      const percentCrop = completedCropRef.current
      const imgElement = imgElementRef.current
      if (!percentCrop || !imgElement) return

      const croppedUrl = await renderCropFromElement(imgElement, percentCrop)
      if (!croppedUrl) return

      onCropConfirm(croppedUrl, imageIndex)

      // Reset crop state
      setCrop(undefined)
      setIsCropOptionsOpen(false)
      completedCropRef.current = null
    },
    [onCropConfirm],
  )

  /**
   * Batch-crop all photos using the current aspect ratio.
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
        const { width, height } = imgElement

        let percentCrop: PercentCrop

        if (aspectRatio !== null) {
          const cropRect = generateCrop(width, height, aspectRatio)
          percentCrop = {
            x: cropRect.x as number,
            y: cropRect.y as number,
            width: cropRect.width as number,
            height: cropRect.height as number,
            unit: "%",
          }
        } else {
          // No aspect ratio — full image (0,0,100,100)
          percentCrop = { x: 0, y: 0, width: 100, height: 100, unit: "%" }
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
    setCrop(undefined)
    completedCropRef.current = null
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
