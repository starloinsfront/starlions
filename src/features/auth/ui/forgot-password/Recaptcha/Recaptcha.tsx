"use client"

import { useEffect, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"

import styles from "./Recaptcha.module.css"

type RecaptchaStatus = "default" | "error" | "expired"

type RecaptchaProps = {
  value: string | null
  onChange: (token: string | null) => void
  error?: string
}

export const Recaptcha = ({ value, onChange, error }: RecaptchaProps) => {
  const [status, setStatus] = useState<RecaptchaStatus>("default")
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    if (!value) {
      recaptchaRef.current?.reset()
    }
  }, [value])

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
  const hasError = Boolean(error)

  return (
    <div className={`${styles.root} ${hasError ? styles.errorBox : ""}`}>
      {isExpired && (
        <p className={styles.expiredText}>Verification expired. Check the checkbox again.</p>
      )}

      <div className={`${styles.box}`}>
        <div className={styles.recaptchaScale}>
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
        </div>
      </div>

      {hasError && !isExpired && (
        <p className={styles.errorText}>
          {error ? error === "Invalid input" && "Please verify that you are not a robot" : error}
        </p>
      )}
    </div>
  )
}
