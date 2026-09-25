"use client"

import { useEffect, useTransition } from "react"

import { Button } from "@/common/components/Button/Button"

import s from "./error.module.css"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MainError({ error, reset }: Props) {
  const [isRetrying, startRetry] = useTransition()

  useEffect(() => {
    console.error("[main-route-error]", {
      digest: error.digest,
      message: error.message,
    })
  }, [error])

  const handleRetry = () => {
    startRetry(() => reset())
  }

  return (
    <section aria-live="assertive" className={s.wrapper} role="alert">
      <div className={s.card}>
        <p className={s.label}>Something went wrong</p>
        <h1 className={s.title}>The page could not be loaded</h1>
        <p className={s.description}>
          The server is temporarily unavailable. Try loading the page again.
        </p>
        {error.digest ? <p className={s.reference}>Error reference: {error.digest}</p> : null}
        <Button disabled={isRetrying} isLoading={isRetrying} onClick={handleRetry} type="button">
          Try again
        </Button>
      </div>
    </section>
  )
}
