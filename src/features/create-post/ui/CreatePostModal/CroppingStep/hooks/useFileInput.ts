import { useRef, useCallback, ChangeEvent } from "react"

type UseFileInputOptions = {
  onFilesSelected: (files: FileList) => void
  multiple?: boolean
  accept?: string
}

export const useFileInput = ({ onFilesSelected }: UseFileInputOptions) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files && files.length > 0) {
        onFilesSelected(files)
      }
      // Reset input so selecting the same file again triggers onChange
      event.target.value = ""
    },
    [onFilesSelected],
  )

  return {
    fileInputRef,
    triggerFileInput,
    handleFileChange,
  }
}
