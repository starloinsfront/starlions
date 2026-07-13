import { useState, useCallback, useMemo } from "react"
import { validateFiles } from "./useFileValidation"
import { useBlobUrls } from "./useBlobUrls"
import type { CreatePostPhoto } from "./createPost.types"

type UsePhotosProps = {
  onLastPhotoRemoved?: () => void
}

export const usePhotos = ({ onLastPhotoRemoved }: UsePhotosProps = {}) => {
  const { createBlobUrl, revokeBlobUrl, trackBlobUrl, revokeAllBlobUrls } = useBlobUrls()
  const [photos, setPhotos] = useState<CreatePostPhoto[]>([])

  const selectedImages = useMemo(
    () => photos.map((photo) => photo.previewUrl),
    [photos],
  )

  const croppedImages = useMemo(
    () => photos.map((photo) => photo.croppedUrl),
    [photos],
  )

  const selectedFilters = useMemo(
    () => photos.map((photo) => photo.filterId),
    [photos],
  )

  const createPhotoObjects = useCallback(
    (files: File[]) =>
      files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: createBlobUrl(file),
        croppedUrl: null,
        filterId: null,
      })),
    [createBlobUrl],
  )

  const selectFiles = useCallback(
    async (files: File[]) => {
      if (!(await validateFiles(files, 0))) return

      revokeAllBlobUrls()
      setPhotos(createPhotoObjects(files))
    },
    [createPhotoObjects, revokeAllBlobUrls],
  )

  const addMoreFiles = useCallback(
    async (files: File[]) => {
      if (!(await validateFiles(files, photos.length))) return

      setPhotos((prev) => [...prev, ...createPhotoObjects(files)])
    },
    [createPhotoObjects, photos.length],
  )

  const removeImage = useCallback(
    (index: number) => {
      const photoToRemove = photos[index]
      if (!photoToRemove) return

      revokeBlobUrl(photoToRemove.previewUrl)
      if (photoToRemove.croppedUrl) {
        revokeBlobUrl(photoToRemove.croppedUrl)
      }

      if (photos.length === 1) {
        onLastPhotoRemoved?.()
        return
      }

      setPhotos((prev) => prev.filter((_, i) => i !== index))
    },
    [photos, revokeBlobUrl, onLastPhotoRemoved],
  )

  const setCroppedImage = useCallback(
    (index: number, url: string) => {
      setPhotos((prev) => {
        const oldPhoto = prev[index]
        if (!oldPhoto) return prev

        if (oldPhoto?.croppedUrl) revokeBlobUrl(oldPhoto.croppedUrl)
        trackBlobUrl(url)
        const updated = [...prev]
        updated[index] = {
          ...oldPhoto,
          croppedUrl: url,
        }
        return updated
      })
    },
    [revokeBlobUrl, trackBlobUrl],
  )

  const setFilter = useCallback((index: number, filterId: string) => {
    setPhotos((prev) => {
      if (!prev[index]) return prev

      const updated = [...prev]
      updated[index] = {
        ...prev[index],
        filterId,
      }
      return updated
    })
  }, [])

  const resetCroppedImages = useCallback(() => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo.croppedUrl) {
          revokeBlobUrl(photo.croppedUrl)
        }

        return {
          ...photo,
          croppedUrl: null,
        }
      }),
    )
  }, [revokeBlobUrl])

  const clearPhotos = useCallback(() => {
    revokeAllBlobUrls()
    setPhotos([])
  }, [revokeAllBlobUrls])

  return {
    photos,
    selectedImages,
    croppedImages,
    selectedFilters,
    selectFiles,
    addMoreFiles,
    removeImage,
    setCroppedImage,
    setFilter,
    resetCroppedImages,
    clearPhotos,
  }
}
