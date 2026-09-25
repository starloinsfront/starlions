"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"

import { Icon } from "@/common/components/Icon/Icon"
import { usePostLayoutMode } from "./usePostLayoutMode"

import s from "./PostDetailModal.module.css"

type Props = {
  closeHref?: string
  mobileHref?: string
}

const usePostModalClose = (closeHref?: string) => {
  const router = useRouter()

  return useCallback(() => {
    if (closeHref) {
      router.replace(closeHref, { scroll: false })

      return
    }

    router.back()
  }, [closeHref, router])
}

export const PostModalControls = ({ closeHref, mobileHref }: Props) => {
  const router = useRouter()
  const { isTabletOrMobile } = usePostLayoutMode()
  const handleClose = usePostModalClose(closeHref)
  const hasRedirectedToMobileRef = useRef(false)

  useEffect(() => {
    if (!isTabletOrMobile || !mobileHref || hasRedirectedToMobileRef.current) {
      return
    }

    hasRedirectedToMobileRef.current = true
    router.replace(mobileHref, { scroll: false })
  }, [isTabletOrMobile, mobileHref, router])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleClose])

  return (
    <button
      aria-label="Close post"
      className={s.overlay}
      onClick={handleClose}
      tabIndex={-1}
      type="button"
    />
  )
}

type CloseButtonProps = {
  closeHref?: string
}

export const PostModalCloseButton = ({ closeHref }: CloseButtonProps) => {
  const handleClose = usePostModalClose(closeHref)

  return (
    <button aria-label="Close" className={s.closeButton} onClick={handleClose} type="button">
      <Icon name="closeOutline" />
    </button>
  )
}
