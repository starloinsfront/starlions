"use client"

import confirmImage from "@/assets/storybook/bro.png"
import { Button } from "@/common/components/Button/Button"
import { Loader } from "@/common/components/Loader/Loader"
import { TextField } from "@/common/components/TextField/TextField"
import { useRegistrationConfirmation } from "@/features/auth/api/useRegistrationConfirmation"
import { useResendConfirmation } from "@/features/auth/api/useResendConfirmation"
import { AuthLinkExpired } from "@/features/auth/ui/AuthLinkExpired/AuthLinkExpired"
import { AuthPageSection } from "@/features/auth/ui/AuthPageSection/AuthPageSection"
import {
  CheckEmailFormValues,
  checkEmailSchema,
} from "@/features/auth/ui/forgot-password/CheckEmail/CheckEmailForm"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import s from "./ConfirmEmail.module.css"
import { ROUTES } from "@/common/constants/route"

export default function ConfirmEmailPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<CheckEmailFormValues>({
    resolver: zodResolver(checkEmailSchema),
    mode: "onChange",
  })

  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams?.get("code")
  const requestedCodeRef = useRef<string | null>(null)

  const { mutate: confirmEmail, isError, isSuccess } = useRegistrationConfirmation()

  const resendMutation = useResendConfirmation({ setError })

  const onSubmit = (data: CheckEmailFormValues) => {
    resendMutation.mutate(data.email)
  }

  useEffect(() => {
    if (!code || requestedCodeRef.current === code) {
      return
    }

    requestedCodeRef.current = code
    confirmEmail({ code })
  }, [code, confirmEmail])

  if (isSuccess)
    return (
      <div className={s.container}>
        <h1 className={s.titlePage}>Congratulations</h1>
        <p className={s.subTitle}>Your email has been confirmed</p>
        <Button onClick={() => router.push(ROUTES.signIn)} className={s.btn}>
          Sign In
        </Button>
        <Image src={confirmImage} alt={"Confirm email"} className={s.confirmImage} />
      </div>
    )

  if (isError || !code)
    return (
      <AuthPageSection>
        <AuthLinkExpired>
          <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
            <TextField
              containerClassName={s.regItem}
              label={"Email"}
              placeholder={"Email"}
              autoComplete={"email"}
              type={"email"}
              errorMessage={errors.email?.message}
              {...register("email")}
            />
            <Button
              type={"submit"}
              className={s.submit}
              isLoading={resendMutation.isPending}
              disabled={!isValid || resendMutation.isPending || resendMutation.isCooldownActive}
            >
              Resend verification link
            </Button>
          </form>
        </AuthLinkExpired>
      </AuthPageSection>
    )

  return (
    <div className={s.loaderBox}>
      <div className={s.loader}>
        <Loader theme="light" />
      </div>
    </div>
  )
}
