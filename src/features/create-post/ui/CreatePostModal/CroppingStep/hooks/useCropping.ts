import { useState, useCallback, useRef, useEffect } from "react"
import type { Point, Area } from "react-easy-crop"
import type { CreatePostPhoto } from "@/features/create-post/model/createPost.types"
import { loadImage, renderCropFromElement } from "./cropUtils"

type CropState = {
  position: Point
  zoom: number
  croppedAreaPixels: Area | null
}

type UseCroppingProps = {
  isCropOptionsOpen: boolean
  closeCropOptions: () => void
}

export const useCropping = (
  photos: CreatePostPhoto[],
  activeIndex: number,
  { isCropOptionsOpen, closeCropOptions }: UseCroppingProps,
) => {
  const [aspectRatio, setAspectRatioState] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null)

  // Per-photo crop storage keyed by photo id.
  const cropsRef = useRef<Record<string, CropState | null>>({})
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

  // Get or initialize crop state for active photo
  const getCropState = useCallback(
    (photoId: string | undefined): CropState => {
      if (!photoId) return { position: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null }
      return cropsRef.current[photoId] ?? { position: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null }
    },
    [],
  )

  const cropState = getCropState(activePhotoId)

  // When the active photo changes, restore its zoom and compute image aspect ratio.
  useEffect(() => {
    if (activePhotoId) {
      const saved = cropsRef.current[activePhotoId]
      setZoom(saved?.zoom ?? 1)
    } else {
      setZoom(1)
    }

    const photo = photos[activeIndex]
    if (photo?.previewUrl) {
      const img = new Image()
      img.onload = () => {
        setImageAspectRatio(img.naturalWidth / img.naturalHeight)
      }
      img.src = photo.previewUrl
    } else {
      setImageAspectRatio(null)
    }
  }, [activePhotoId, activeIndex, photos])

  // Set aspect ratio and close menu
  const setAspectRatio = useCallback(
    (ratio: number | null) => {
      setAspectRatioState(ratio)
      closeCropOptions()

      // Reset position, zoom and clear stale crop when changing aspect ratio
      if (activePhotoId) {
        cropsRef.current[activePhotoId] = {
          position: { x: 0, y: 0 },
          zoom: 1,
          croppedAreaPixels: null,
        }
      }
      setZoom(1)
    },
    [activePhotoId, closeCropOptions],
  )

  // Handle crop change (during drag)
  const handleCropChange = useCallback(
    (position: Point) => {
      if (activePhotoId) {
        const prev = cropsRef.current[activePhotoId]
        cropsRef.current[activePhotoId] = {
          position,
          zoom: prev?.zoom ?? 1,
          croppedAreaPixels: prev?.croppedAreaPixels ?? null,
        }
      }
    },
    [activePhotoId],
  )

  // Handle zoom change
  const handleZoomChange = useCallback(
    (newZoom: number) => {
      setZoom(newZoom)
      if (activePhotoId) {
        const prev = cropsRef.current[activePhotoId]
        cropsRef.current[activePhotoId] = {
          position: prev?.position ?? { x: 0, y: 0 },
          zoom: newZoom,
          croppedAreaPixels: prev?.croppedAreaPixels ?? null,
        }
      }
    },
    [activePhotoId],
  )

  // Handle crop complete — save croppedAreaPixels
  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      if (activePhotoId) {
        const prev = cropsRef.current[activePhotoId]
        cropsRef.current[activePhotoId] = {
          position: prev?.position ?? { x: 0, y: 0 },
          zoom: prev?.zoom ?? 1,
          croppedAreaPixels,
        }
      }
    },
    [activePhotoId],
  )

  // Confirm crop and generate cropped image via Canvas
  const handleConfirmCrop = useCallback(async (): Promise<string | null> => {
    const state = activePhotoId ? cropsRef.current[activePhotoId] : null
    if (!state?.croppedAreaPixels) return null

    const photo = photos[activeIndex]
    if (!photo) return null

    const imgElement = await loadImage(photo.previewUrl)
    const croppedUrl = await renderCropFromElement(imgElement, state.croppedAreaPixels)
    if (!croppedUrl) return null

    // Clear this photo's crop state (it's now baked into croppedImages)
    if (activePhotoId) {
      cropsRef.current[activePhotoId] = null
    }
    setZoom(1)
    closeCropOptions()

    return croppedUrl
  }, [activeIndex, activePhotoId, photos, closeCropOptions])

  /**
   * Batch-crop all photos using the current aspect ratio.
   * For the active photo, use its saved crop (if any).
   * For other photos: use full image if no crop saved.
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
        const savedState = cropsRef.current[photo.id]

        if (savedState?.croppedAreaPixels) {
          const imgElement = await loadImage(photo.previewUrl)
          const url = await renderCropFromElement(imgElement, savedState.croppedAreaPixels)
          results[i] = url
        } else {
          // No crop saved — use full image
          const imgElement = await loadImage(photo.previewUrl)
          const fullArea: Area = {
            x: 0,
            y: 0,
            width: imgElement.naturalWidth,
            height: imgElement.naturalHeight,
          }
          const url = await renderCropFromElement(imgElement, fullArea)
          results[i] = url
        }
      }

      return results
    },
    [],
  )

  // Reset all crop state
  const resetCrop = useCallback(() => {
    closeCropOptions()
    setAspectRatioState(null)
    setZoom(1)
    cropsRef.current = {}
  }, [closeCropOptions])

  return {
    aspectRatio,
    imageAspectRatio,
    zoom,
    selectedRatioId,
    cropPosition: cropState.position,
    setAspectRatio,
    setZoom: handleZoomChange,
    handleCropChange,
    handleCropComplete,
    handleConfirmCrop,
    cropAllImages,
    resetCrop,
  }
}
