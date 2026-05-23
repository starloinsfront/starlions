"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import s from "./ConfirmEmail.module.css"
import { useRegistrationConfirmation } from "@/features/auth/api/useRegistrationConfirmation"
import { Button } from "@/common/components/Button/Button"
import Image from "next/image"
import confirmImage from "@/assets/storybook/bro.png"
import reEmail from "@/assets/storybook/rafiki.png"
import { TextField } from "@/common/components/TextField/TextField"
import { useForm } from "react-hook-form"
import { RegisterFormData, registerSchema } from "@/features/auth/model/register.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useResendConfirmation } from "@/features/auth/api/useResendConfirmation"

export default function ConfirmEmailPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      isTermsAccepted: false,
    },
  })

  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams?.get("code")
  const resendMutation = useResendConfirmation()
  const { mutate: confirmEmail, isPending, isError } = useRegistrationConfirmation()
  const requestedCodeRef = useRef<string | null>(null)
  const onSubmit = (data: RegisterFormData) => {
    resendMutation.mutate(data.email)
  }

  useEffect(() => {
    if (!code) return
    if (requestedCodeRef.current === code) return

    requestedCodeRef.current = code
    confirmEmail({ code })
  }, [code, confirmEmail])

  if (isPending) return <div>Confirming email...</div>

  if (isError)
    return (
      <div className={s.container}>
        <h1 className={s.titlePage}>Email verification link expired</h1>
        <p className={s.subTitle}>
          Looks like the verification link has expired. Not to worry, we can send the link again
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            containerClassName={s.regItem}
            label={"Email"}
            placeholder={"Email"}
            autoComplete={"email"}
            type={"email"}
            errorMessage={errors.email?.message}
            {...register("email")}
          />
          <Button type={"submit"} className={s.btn}>
            Sign In
          </Button>
        </form>
        <Image src={reEmail} alt={"Confirm email"} className={s.confirmImage} />
      </div>
    )

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
