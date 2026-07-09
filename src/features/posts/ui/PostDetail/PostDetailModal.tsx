"use client"

import { useRouter } from "next/navigation"
import { type ReactNode, useEffect, useId, useRef } from "react"

import { CompoundModal } from "@/common/components/CompoundModal"
import { usePostLayoutMode } from "./usePostLayoutMode"
import s from "./PostDetailModal.module.css"

type Props = {
  children: ReactNode
  closeHref?: string
  mobileHref?: string
}

export const PostDetailModal = ({ children, closeHref, mobileHref }: Props) => {
  const descriptionId = useId()
  const router = useRouter()
  const { isMobile } = usePostLayoutMode()
  const hasRedirectedToMobileRef = useRef(false)

  useEffect(() => {
    if (!isMobile || !mobileHref || hasRedirectedToMobileRef.current) {
      return
    }

    hasRedirectedToMobileRef.current = true
    window.location.assign(mobileHref)
  }, [isMobile, mobileHref, router])

  const handleClose = () => {
    if (closeHref) {
      router.replace(closeHref, { scroll: false })

      return
    }

    router.back()
  }

  if (isMobile && mobileHref) {
    return null
  }

  return (
    <CompoundModal.Root open onOpenChange={(open) => !open && handleClose()}>
      <CompoundModal.Portal>
        <CompoundModal.Overlay className={s.overlay} />
        <CompoundModal.Content
          aria-describedby={descriptionId}
          className={s.content}
          size="xlg"
        >
          <CompoundModal.Close className={s.closeButton} />
          <CompoundModal.Title className={s.title}>Post details</CompoundModal.Title>
          <CompoundModal.Description id={descriptionId}>
            Detailed post view with media, comments and likes.
          </CompoundModal.Description>
          {children}
        </CompoundModal.Content>
      </CompoundModal.Portal>
    </CompoundModal.Root>
  )
}
