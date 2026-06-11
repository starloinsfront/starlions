import { useEffect } from "react"
import styles from "./ResetCropDialog.module.css"

type ResetCropDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
}

export const ResetCropDialog = ({ isOpen, onClose, onConfirm, onCancel }: ResetCropDialogProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-crop-title"
        aria-describedby="reset-crop-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="reset-crop-title" className={styles.title}>
          Reset crop?
        </h3>
        <p id="reset-crop-desc" className={styles.description}>
          Your current crop settings will be lost. Do you want to continue?
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            No, keep crop
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirm}>
            Yes, reset
          </button>
        </div>
      </div>
    </div>
  )
}
