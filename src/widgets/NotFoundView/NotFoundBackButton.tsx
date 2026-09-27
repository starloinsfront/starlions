"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/common/components/Button/Button"
import { ROUTES } from "@/common/constants/route"

import styles from "./NotFoundView.module.css"

export const NotFoundBackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()

      return
    }

    router.replace(ROUTES.home)
  }

  return (
    <Button className={styles.button} onClick={handleBack} type="button" variant="secondary">
      Go back
    </Button>
  )
}
