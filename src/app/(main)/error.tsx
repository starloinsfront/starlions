"use client"

import { Button } from "@/common/components/Button/Button"

import s from "./error.module.css"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MainError({ reset }: Props) {
  return (
    <section aria-live="assertive" className={s.wrapper} role="alert">
      <div className={s.card}>
        <p className={s.label}>Something went wrong</p>
        <h1 className={s.title}>The page could not be loaded</h1>
        <p className={s.description}>
          The server is temporarily unavailable. Try loading the page again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </section>
  )
}
