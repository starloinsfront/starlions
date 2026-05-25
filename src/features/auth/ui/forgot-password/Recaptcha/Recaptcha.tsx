"use client"

import { Loader } from "@/common/components/Loader/Loader"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import type ReCAPTCHAInstance from "react-google-recaptcha"

import styles from "./Recaptcha.module.css"

type RecaptchaStatus = "default" | "error" | "expired"

type RecaptchaProps = {
  value: string | null
  onChange: (token: string | null) => void
  error?: string
  resetKey?: number
}

const ReCAPTCHA = lazy(() => import("react-google-recaptcha"))

const RecaptchaFallback = () => {
  return (
    <div className={styles.fallback}>
      <Loader />
    </div>
  )
}

const getRecaptchaErrorMessage = (error?: string) => {
  if (!error) {
    return null
  }

  if (error === "Invalid input" || error === "INVALID_RECAPTCHA") {
    return "Please verify that you are not a robot"
  }

  return error
}

export const Recaptcha = ({ value, onChange, error, resetKey }: RecaptchaProps) => {
  const [status, setStatus] = useState<RecaptchaStatus>("default")
  const recaptchaRef = useRef<ReCAPTCHAInstance>(null)
  const previousResetKeyRef = useRef(resetKey)

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    if (!value) {
      recaptchaRef.current?.reset()
    }
  }, [value])

  useEffect(() => {
    if (resetKey === undefined || previousResetKeyRef.current === resetKey) {
      return
    }

    previousResetKeyRef.current = resetKey
    recaptchaRef.current?.reset()
    setStatus("default")
    onChange(null)
  }, [resetKey, onChange])

  if (!siteKey) {
    return null
  }

  const handleChange = (token: string | null) => {
    setStatus("default")
    onChange(token)
  }

  const handleExpired = () => {
    setStatus("expired")
    onChange(null)
  }

  const handleErrored = () => {
    setStatus("error")
    onChange(null)
  }

  const isExpired = status === "expired"
  const isRecaptchaError = status === "error"

  const errorMessage = getRecaptchaErrorMessage(error)
  const hasError = Boolean(errorMessage) || isExpired || isRecaptchaError

  return (
    <div className={`${styles.root} ${hasError ? styles.errorBox : ""}`}>
      {isExpired && (
        <p className={styles.expiredText}>Verification expired. Check the checkbox again.</p>
      )}

      <div className={styles.box}>
        <div className={styles.recaptchaScale}>
          <Suspense fallback={<RecaptchaFallback />}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              theme="dark"
              onChange={handleChange}
              onExpired={handleExpired}
              onErrored={handleErrored}
              size="normal"
              hl="en"
            />
          </Suspense>
        </div>
      </div>

      {isRecaptchaError && (
        <p className={styles.errorText}>Verification failed. Please try again.</p>
      )}

      {errorMessage && !isExpired && !isRecaptchaError && (
        <p className={styles.errorText}>{errorMessage}</p>
      )}
    </div>
  )
}
