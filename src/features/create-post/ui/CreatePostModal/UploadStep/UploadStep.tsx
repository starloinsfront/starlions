"use client"

import { useRef, useCallback } from "react"
import { Button } from "@/common/components/Button/Button"
import { Icon } from "@/common/components/Icon/Icon"
import styles from "./UploadStep.module.css"
import type { UploadStepProps } from "./UploadStep.types"

export const UploadStep = ({ onSelectFiles, onOpenDraft }: UploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectFiles = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files && files.length > 0) {
        onSelectFiles(files)
      }
    },
    [onSelectFiles],
  )

  return (
    <div className={styles.body}>
      <div className={styles.uploadPlaceholder}>
        <Icon
          name="imageOutline"
          width={48}
          height={48}
          className={styles.uploadIcon}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          onClick={handleSelectFiles}
          type="button"
        >
          Select from Computer
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={onOpenDraft}
          type="button"
        >
          Open Draft
        </Button>
      </div>
    </div>
  )
}
