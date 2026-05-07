"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/common/components/Button/Button"
import { ROUTES } from "@/common/constants/route"
import { useConfirmRegistration } from "@/common/hooks/useConfirmRegistration"
import { ApiError } from "@/features/auth/api/authApi.types"
import s from "./ConfirmEmail.module.css"

type ConfirmationStatus = "loading" | "success" | "error" | "expired" | "notFound"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get("code")

  const [status, setStatus] = useState<ConfirmationStatus>("loading")
  const [errorMessage, setErrorMessage] = useState("")

  const { confirmAsync } = useConfirmRegistration()

  useEffect(() => {
    if (!code) {
      return
    }

    const confirmEmail = async () => {
      try {
        await confirmAsync(code)
        setStatus("success")

        setTimeout(() => {
          router.push(ROUTES.signIn)
        }, 3000)
      } catch (err: unknown) {
        const error = err as ApiError & { message?: string }

        if (error?.status === 400) {
          setStatus("expired")
          setErrorMessage(
            error?.data?.message || "The confirmation code has expired or is invalid.",
          )
        } else if (error?.status === 404) {
          setStatus("notFound")
          setErrorMessage(error?.data?.message || "User not found.")
        } else {
          setStatus("error")
          setErrorMessage(error?.message || "Failed to confirm email. Please try again.")
        }
      }
    }

    void confirmEmail()
  }, [code, confirmAsync, router])

  if (!code) {
    return (
      <section className={s.section}>
        <div className={s.content}>
          <div className={`${s.statusIcon} ${s.errorIcon}`}>!</div>
          <h1 className={s.title}>Confirmation Failed</h1>
          <p className={s.description}>No confirmation code provided.</p>
          <div className={s.buttonGroup}>
            <Button className={s.button} asChild>
              <Link href={ROUTES.signUp}>Sign Up Again</Link>
            </Button>
            <Button className={s.button} variant="secondary" asChild>
              <Link href={ROUTES.signIn}>Go to Login</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (status === "loading") {
    return (
      <section className={s.section}>
        <div className={s.content}>
          <div className={s.spinner} />
          <h1 className={s.title}>Confirming your email...</h1>
          <p className={s.description}>Please wait while we verify your email address.</p>
        </div>
      </section>
    )
  }

  if (status === "success") {
    return (
      <section className={s.section}>
        <div className={s.content}>
          <div className={`${s.statusIcon} ${s.successIcon}`}>OK</div>
          <h1 className={s.title}>Email Confirmed</h1>
          <p className={s.description}>
            Your email has been successfully verified and your account is now active.
          </p>
          <p className={s.secondaryText}>
            You will be redirected to the login page in a few seconds.
          </p>
          <Button className={s.button} asChild>
            <Link href={ROUTES.signIn}>Go to Login</Link>
          </Button>
        </div>
      </section>
    )
  }

  if (status === "expired") {
    return (
      <section className={s.section}>
        <div className={s.content}>
          <div className={`${s.statusIcon} ${s.errorIcon}`}>!</div>
          <h1 className={s.title}>Link Expired</h1>
          <p className={s.description}>{errorMessage}</p>
          <p className={s.secondaryText}>
            The confirmation link has expired or has already been used.
          </p>
          <div className={s.buttonGroup}>
            <Button className={s.button} asChild>
              <Link href={ROUTES.signUp}>Sign Up Again</Link>
            </Button>
            <Button className={s.button} variant="secondary" asChild>
              <Link href={ROUTES.signIn}>Go to Login</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (status === "notFound") {
    return (
      <section className={s.section}>
        <div className={s.content}>
          <div className={`${s.statusIcon} ${s.errorIcon}`}>!</div>
          <h1 className={s.title}>User Not Found</h1>
          <p className={s.description}>{errorMessage}</p>
          <p className={s.secondaryText}>
            We couldn&apos;t find a user associated with this confirmation link.
          </p>
          <div className={s.buttonGroup}>
            <Button className={s.button} asChild>
              <Link href={ROUTES.signUp}>Create Account</Link>
            </Button>
            <Button className={s.button} variant="secondary" asChild>
              <Link href={ROUTES.signIn}>Go to Login</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={s.section}>
      <div className={s.content}>
        <div className={`${s.statusIcon} ${s.errorIcon}`}>!</div>
        <h1 className={s.title}>Confirmation Failed</h1>
        <p className={s.description}>{errorMessage}</p>
        <div className={s.buttonGroup}>
          <Button className={s.button} asChild>
            <Link href={ROUTES.signUp}>Sign Up Again</Link>
          </Button>
          <Button className={s.button} variant="secondary" asChild>
            <Link href={ROUTES.signIn}>Go to Login</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
