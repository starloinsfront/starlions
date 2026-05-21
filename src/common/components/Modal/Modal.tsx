import clsx from "clsx"
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react"

import { CompoundModal } from "../CompoundModal"
import { ModalSize } from "../CompoundModal/compoundModal.types"

type Props = {
  /**
   * Controls modal visibility.
   */
  open: boolean

  /**
   * Called when the modal should be closed.
   *
   * Used by Radix `onOpenChange` when the user closes the modal
   * via overlay click, Escape key or close button.
   */
  onClose: () => void

  /**
   * Modal title rendered inside `Dialog.Title`.
   *
   * Required for accessibility.
   */
  modalTitle: string

  /**
   * Main modal content.
   */
  children: ReactNode

  /**
   * Optional modal description rendered inside `Dialog.Description`.
   *
   * If provided, it will be automatically connected to the modal content
   * through `aria-describedby`.
   */
  description?: ReactNode

  /**
   * Custom id for `aria-describedby`.
   *
   * Use it only if you need to connect the modal to an external description.
   * If not provided, the id will be generated automatically.
   */
  ariaDescribedBy?: string

  /**
   * Modal content size.
   *
   * Available widths:
   *
   * xs — 378px
   *
   * sm — 438px
   *
   * md — 492px
   *
   * lg — 644px
   */
  size?: ModalSize

  /**
   * Additional className for modal content.
   *
   * Useful when a specific modal needs custom spacing or layout.
   */
  contentClassName?: string
} & Omit<
  ComponentPropsWithoutRef<typeof CompoundModal.Content>,
  "children" | "title" | "aria-describedby" | "size" | "contentClassName"
>

/**
 * Project-level modal component.
 *
 * This component is a convenient wrapper around `CompoundModal`.
 * It provides the standard modal structure used across the project:
 *
 * - Root
 * - Portal
 * - Overlay
 * - Content
 * - Header
 * - Title
 * - Close button
 * - Optional Description
 * - MainContent
 *
 * Use `Modal` for simple/common cases.
 * Use `CompoundModal` directly when a modal needs a fully custom structure.
 */
export const Modal = ({
  size = "xs",
  modalTitle,
  description,
  ariaDescribedBy,
  onClose,
  children,
  className,
  contentClassName,
  open,
  ...contentProps
}: Props) => {
  const generatedDescriptionId = useId()

  const descriptionId = description ? (ariaDescribedBy ?? generatedDescriptionId) : undefined

  return (
    <CompoundModal.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
    >
      <CompoundModal.Portal>
        <CompoundModal.Overlay />

        <CompoundModal.Content
          size={size}
          className={clsx(className, contentClassName)}
          aria-describedby={descriptionId}
          {...contentProps}
        >
          <CompoundModal.Header>
            <CompoundModal.Title>{modalTitle}</CompoundModal.Title>
            <CompoundModal.Close />
          </CompoundModal.Header>

          {description && (
            <CompoundModal.Description id={descriptionId}>{description}</CompoundModal.Description>
          )}

          <CompoundModal.MainContent>{children}</CompoundModal.MainContent>
        </CompoundModal.Content>
      </CompoundModal.Portal>
    </CompoundModal.Root>
  )
}
