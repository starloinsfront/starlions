"use client"

import { useRouter } from "next/navigation"
import { type ReactNode, useId } from "react"

import { CompoundModal } from "@/common/components/CompoundModal"
import s from "./PostDetailModal.module.css"

type Props = {
  children: ReactNode
  closeHref?: string
}

export const PostDetailModal = ({ children, closeHref }: Props) => {
  const descriptionId = useId()
  const router = useRouter()

  const handleClose = () => {
    if (closeHref) {
      router.replace(closeHref, { scroll: false })

      return
    }

    router.back()
  }

  return (
    <CompoundModal.Root open onOpenChange={(open) => !open && handleClose()}>
      <CompoundModal.Overlay className={s.overlay} />
      <CompoundModal.Content aria-describedby={descriptionId} className={s.content} size="xlg">
        <CompoundModal.Close className={s.closeButton} />
        <CompoundModal.Title className={s.title}>Post details</CompoundModal.Title>
        {children}
      </CompoundModal.Content>
    </CompoundModal.Root>
  )
}
