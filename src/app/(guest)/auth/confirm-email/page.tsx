"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import s from "./ConfirmEmail.module.css"
import { useRegistrationConfirmation } from "@/features/auth/api/useRegistrationConfirmation"
import { Button } from "@/common/components/Button/Button"
import Image from "next/image"
import confirmImage from "@/assets/storybook/bro.png"

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get("code")

  const mutation = useRegistrationConfirmation()

  useEffect(() => {
    if (!code) return

    mutation.mutate({ code }, {})
  }, [code, mutation])

  if (mutation.isPending) return <div>Confirming email...</div>

  if (mutation.isError) return <div>Link is invalid or expired</div>

  return (
    <div className={s.container}>
      <h1 className={s.titlePage}>Congratulations</h1>
      <p className={s.subTitle}>Your email has been confirmed</p>
      <Button onClick={() => router.push("/login")} className={s.btn}>
        Sign In
      </Button>
      <Image src={confirmImage} alt={"Confirm email"} className={s.confirmImage} />
    </div>
  )
}
