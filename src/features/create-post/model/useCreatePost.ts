"use client"

import { useState, useCallback, useEffect, useRef } from "react"

export type Step = "upload" | "cropping" | "filters" | "publication"

type CreatePostState = {
  step: Step
  selectedImages: string[]
  /** Cropped version for each photo; null = not yet cropped. */
  croppedImages: (string | null)[]
  /** Selected filter ID per photo; null = no filter (uses "normal"). */
  selectedFilters: (string | null)[]
  isGalleryPanelOpen: boolean
}

type CreatePostActions = {
  selectFiles: (files: FileList) => void
  addMoreFiles: (files: FileList) => void
  removeImage: (index: number) => void
  replaceImage: (index: number, newUrl: string) => void
  /** Store a cropped result for a specific photo index. */
  setCroppedImage: (index: number, url: string) => void
  /** Set a filter for a specific photo index. */
  setFilter: (index: number, filterId: string) => void
  toggleGalleryPanel: () => void
  goBack: () => void
  /** Navigate from cropping → filters. */
  goNext: () => void
  /** Navigate from filters → cropping (preserves croppedImages). */
  goBackToCropping: () => void
  /** Navigate from publication → filters. */
  goBackToFilters: () => void
  /** Clear all cropped results and revoke their blob URLs. */
  resetCroppedImages: () => void
  reset: () => void
}

export function useCreatePost(): CreatePostState & CreatePostActions {
  const [step, setStep] = useState<Step>("upload")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [croppedImages, setCroppedImages] = useState<(string | null)[]>([])
  const [selectedFilters, setSelectedFilters] = useState<(string | null)[]>([])
  const [isGalleryPanelOpen, setIsGalleryPanelOpen] = useState(false)

  // Single set tracks ALL blob URLs (originals + cropped) for cleanup
  const blobUrlsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const urls = blobUrlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const createBlobUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file)
    blobUrlsRef.current.add(url)
    return url
  }, [])

  const revokeBlobUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url)
    blobUrlsRef.current.delete(url)
  }, [])

  const selectFiles = useCallback(
    (files: FileList) => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      blobUrlsRef.current.clear()

      const urls = Array.from(files).map(createBlobUrl)
      setSelectedImages(urls)
      setCroppedImages([])
      setSelectedFilters([])
      setStep("cropping")
      setIsGalleryPanelOpen(false)
    },
    [createBlobUrl],
  )

  const addMoreFiles = useCallback(
    (files: FileList) => {
      const newUrls = Array.from(files).map(createBlobUrl)
      setSelectedImages((prev) => [...prev, ...newUrls])
      setCroppedImages((prev) => [...prev, ...newUrls.map(() => null)])
      setSelectedFilters((prev) => [...prev, ...newUrls.map(() => null)])
    },
    [createBlobUrl],
  )

  const removeImage = useCallback(
    (index: number) => {
      const urlToRemove = selectedImages[index]
      revokeBlobUrl(urlToRemove)

      const croppedUrl = croppedImages[index]
      if (croppedUrl) revokeBlobUrl(croppedUrl)

      setSelectedImages((prev) => prev.filter((_, i) => i !== index))
      setCroppedImages((prev) => prev.filter((_, i) => i !== index))
      setSelectedFilters((prev) => prev.filter((_, i) => i !== index))

      if (selectedImages.length === 1) {
        setStep("upload")
        setIsGalleryPanelOpen(false)
      }
    },
    [selectedImages, croppedImages, revokeBlobUrl],
  )

  const replaceImage = useCallback(
    (index: number, newUrl: string) => {
      const oldUrl = selectedImages[index]
      revokeBlobUrl(oldUrl)
      blobUrlsRef.current.add(newUrl)
      setSelectedImages((prev) => {
        const updated = [...prev]
        updated[index] = newUrl
        return updated
      })
    },
    [selectedImages, revokeBlobUrl],
  )

  const setCroppedImage = useCallback(
    (index: number, url: string) => {
      setCroppedImages((prev) => {
        const oldUrl = prev[index]
        if (oldUrl) revokeBlobUrl(oldUrl)
        blobUrlsRef.current.add(url)
        const updated = [...prev]
        updated[index] = url
        return updated
      })
    },
    [revokeBlobUrl],
  )

  const setFilter = useCallback((index: number, filterId: string) => {
    setSelectedFilters((prev) => {
      const updated = [...prev]
      updated[index] = filterId
      return updated
    })
  }, [])

  const toggleGalleryPanel = useCallback(() => {
    setIsGalleryPanelOpen((prev) => !prev)
  }, [])

  const goBack = useCallback(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    blobUrlsRef.current.clear()
    setSelectedImages([])
    setCroppedImages([])
    setSelectedFilters([])
    setStep("upload")
    setIsGalleryPanelOpen(false)
  }, [])

  const goNext = useCallback(() => {
    setStep((prev) => (prev === "cropping" ? "filters" : "publication"))
  }, [])

  const goBackToCropping = useCallback(() => {
    setStep("cropping")
  }, [])

  const goBackToFilters = useCallback(() => {
    setStep("filters")
  }, [])

  const resetCroppedImages = useCallback(() => {
    croppedImages.forEach((url) => {
      if (url) revokeBlobUrl(url)
    })
    setCroppedImages(croppedImages.map(() => null))
  }, [croppedImages, revokeBlobUrl])

  const reset = useCallback(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    blobUrlsRef.current.clear()
    setSelectedImages([])
    setCroppedImages([])
    setSelectedFilters([])
    setStep("upload")
    setIsGalleryPanelOpen(false)
  }, [])

  return {
    step,
    selectedImages,
    croppedImages,
    selectedFilters,
    isGalleryPanelOpen,
    selectFiles,
    addMoreFiles,
    removeImage,
    replaceImage,
    setCroppedImage,
    setFilter,
    toggleGalleryPanel,
    goBack,
    goNext,
    goBackToCropping,
    goBackToFilters,
    resetCroppedImages,
    reset,
  }
}
