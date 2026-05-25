"use client"

import { Toaster } from "sonner"

import styles from "./ToastProvider.module.css"

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-left"
      duration={4000}
      closeButton
      expand
      visibleToasts={4}
      gap={8}
      icons={{
        success: null,
        error: null,
        warning: null,
        info: null,
      }}
      className={styles.toaster}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: styles.toast,
          error: styles.error,
          success: styles.success,
          warning: styles.warning,
          info: styles.info,
          closeButton: styles.closeButton,
        },
      }}
    />
  )
}
