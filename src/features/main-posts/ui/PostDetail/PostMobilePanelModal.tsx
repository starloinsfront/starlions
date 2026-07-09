"use client"

import clsx from "clsx"
import { type ReactNode, useId } from "react"

import { CompoundModal } from "@/common/components/CompoundModal"
import { Icon } from "@/common/components/Icon/Icon"
import s from "./PostMobilePanelModal.module.css"

type Props = {
  children: ReactNode
  description: string
  isOpen: boolean
  onClose: () => void
  reserveBottomNavigation?: boolean
  title: string
}

export const PostMobilePanelModal = ({
  children,
  description,
  isOpen,
  onClose,
  reserveBottomNavigation = false,
  title,
}: Props) => {
  const descriptionId = useId()

  const panelClassName = clsx(s.content, reserveBottomNavigation && s.contentWithBottomNavigation)
  const overlayClassName = clsx(s.overlay, reserveBottomNavigation && s.overlayWithBottomNavigation)

  return (
    <CompoundModal.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CompoundModal.Portal>
        <CompoundModal.Overlay className={overlayClassName} />
        <CompoundModal.Content aria-describedby={descriptionId} className={panelClassName} size="lg">
          <CompoundModal.Header className={s.header}>
            <button aria-label="Back to post" className={s.backButton} onClick={onClose} type="button">
              <Icon height={24} name="arrowBackOutline" width={24} />
            </button>
            <CompoundModal.Title className={s.title}>{title}</CompoundModal.Title>
            <span aria-hidden="true" className={s.headerSpacer} />
          </CompoundModal.Header>
          <CompoundModal.Description id={descriptionId}>{description}</CompoundModal.Description>
          <CompoundModal.MainContent className={s.mainContent}>{children}</CompoundModal.MainContent>
        </CompoundModal.Content>
      </CompoundModal.Portal>
    </CompoundModal.Root>
  )
}
