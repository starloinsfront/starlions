"use client"

import { useEffect, useState } from "react"

import { Button } from "@/common/components/Button/Button"

import s from "./error.module.css"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MainError({ error }: Props) {
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    console.error("[main-route-error]", {
      digest: error.digest,
      message: error.message,
    })
  }, [error])

  const handleRetry = () => {
    setIsRetrying(true)

    // A full reload guarantees a new document/RSC request after a server
    // render failure. Calling reset() alone may only retry the cached client
    // boundary and therefore never reach the server again.
    window.location.reload()
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
