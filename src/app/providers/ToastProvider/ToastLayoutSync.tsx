"use client"

import { useEffect } from "react"

type ToastLayoutSyncProps = {
  withSidebar: boolean
}

export const ToastLayoutSync = ({ withSidebar }: ToastLayoutSyncProps) => {
  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty("--toast-left-offset", withSidebar ? "calc( 220px - 47px)" : "24px")

    return () => {
      root.style.setProperty("--toast-left-offset", "24px")
    }
  }, [withSidebar])

  return null
}
