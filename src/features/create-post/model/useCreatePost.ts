"use client"

import { useState, useCallback, useEffect, useRef } from "react"

export type Step = "upload" | "cropping"

type CreatePostState = {
  step: Step
  imageUrl: string | null
}

type CreatePostActions = {
  selectFiles: (files: FileList) => void
  goBack: () => void
  goNext: () => void
  reset: () => void
}

export function useCreatePost(): CreatePostState & CreatePostActions {
  const [step, setStep] = useState<Step>("upload")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const imageUrlRef = useRef<string | null>(null)

  // Keep ref in sync for cleanup in unmount effect
  useEffect(() => {
    imageUrlRef.current = imageUrl
  }, [imageUrl])

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current)
      }
    }
  }, [])

  const revokeCurrentImage = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
      setImageUrl(null)
    }
  }, [imageUrl])

  const selectFiles = useCallback((files: FileList) => {
    const url = URL.createObjectURL(files[0])
    setImageUrl(url)
    setStep("cropping")
  }, [])

  const goBack = useCallback(() => {
    revokeCurrentImage()
    setStep("upload")
  }, [revokeCurrentImage])

  const goNext = useCallback(() => {
    // TODO: transition to next step (e.g. filters → publish)
  }, [])

  const reset = useCallback(() => {
    revokeCurrentImage()
    setStep("upload")
  }, [revokeCurrentImage])

  return {
    step,
    imageUrl,
    selectFiles,
    goBack,
    goNext,
    reset,
  }
}
