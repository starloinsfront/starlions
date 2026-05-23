"use client"

import { Button } from "@/common/components/Button/Button"
import { TextField } from "@/common/components/TextField/TextField"
import { ROUTES } from "@/common/constants/route"
import { emailSchema } from "@/features/auth/model/auth-schemas"
import { usePasswordRecovery } from "@/features/auth/model/usePasswordRecovery"
import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
import { EmailSentModal } from "../EmailSentModal/EmailSentModal"
import { Recaptcha } from "../Recaptcha/Recaptcha"
import styles from "./ForgotPasswordForm.module.css"

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  recaptchaToken: z.string().min(1, "Please verify that you are not a robot"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordForm = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      recaptchaToken: "",
    },
  })

  const { mutate, isPending, isCooldownActive } = usePasswordRecovery<ForgotPasswordFormValues>({
    setError,
    onSuccess: (email) => {
      setEmail(email)
      setOpen(true)
    },
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
    mutate(data)
  }

  const handleOkClick = () => {
    setOpen(false)
    router.push(ROUTES.emailCheck)
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={clsx("h1", styles.title)}>Forgot Password</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          id="email"
          type="email"
          placeholder="example@mail.com"
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <p className={clsx("regularText14", styles.description)}>
          Enter your email address and we will send you further instructions
        </p>
        <div className={styles.box}>
          <Button
            className={styles.sendButton}
            type="submit"
            disabled={!isValid || isCooldownActive || isPending}
            isLoading={isPending}
          >
            Send link
          </Button>
          <Button variant="link" className={styles.sendButton} asChild>
            <Link href={ROUTES.signIn}>Back to Sign In</Link>
          </Button>
          <Controller
            name="recaptchaToken"
            control={control}
            rules={{
              required: "Please verify that you are not a robot",
            }}
            render={({ field, fieldState }) => (
              <Recaptcha
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </form>

      {open && <EmailSentModal email={email} onClose={handleOkClick} open={open} />}
    </div>
  )
}
