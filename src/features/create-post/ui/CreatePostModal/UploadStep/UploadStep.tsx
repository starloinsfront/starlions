"use client"

import { Button } from "@/common/components/Button/Button"
import { Icon } from "@/common/components/Icon/Icon"
import { useFileInput } from "@/common/hooks/useFileInput"
import styles from "./UploadStep.module.css"
import type { UploadStepProps } from "./UploadStep.types"

export const UploadStep = ({ onSelectFiles, onOpenDraft }: UploadStepProps) => {
  const { fileInputRef, triggerFileInput, handleFileChange } = useFileInput({
    onFilesSelected: onSelectFiles,
  })

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
          onClick={triggerFileInput}
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
