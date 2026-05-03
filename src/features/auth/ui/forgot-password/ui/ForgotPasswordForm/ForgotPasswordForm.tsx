"use client"

import { TextField } from "@/common/components/TextField/TextField"
import styles from "./ForgotPasswordForm.module.css"
import { clsx } from "clsx"
import { Button } from "@/common/components/Button/Button"
import Link from "next/link"
import { ROUTES } from "@/common/constants/route"
import { Modal } from "@/common/components/Modal/Modal"
import { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { emailSchema } from "@/features/auth/model/auth-schemas"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect } from "next/navigation"
import { Recaptcha } from "../Recaptcha/Recaptcha"

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  recaptcha: z.string().min(1, "Please verify that you are not a robot"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordForm = () => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [token, setToken] = useState<string | null>(null)

  console.log(token)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
    console.log(data)

    setEmail(data.email)
    setOpen(true)
  }

  const handleOkClick = () => {
    setOpen(false)
    redirect(ROUTES.emailCheck)
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={clsx("h1", styles.title)}>Forgot Password</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          id="email"
          type="email"
          placeholder="Epam@epam.com"
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <p className={clsx("regularText14", styles.description)}>
          Enter your email address and we will send you further instructions
        </p>
        <div className={styles.box}>
          <Button className={styles.sendButton} type="submit" disabled={!isValid || isSubmitting}>
            Send link
          </Button>
          <Button variant="link" className={styles.sendButton} asChild>
            <Link href={ROUTES.signIn}>Back to Sign In</Link>
          </Button>
        </div>
        <Controller
          name="recaptcha"
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
      </form>
      <Modal modalTitle="Email sent" onClose={() => setOpen(false)} open={open} size="sm">
        <div className={styles.dialog}>
          <p className={clsx("regularText16", styles.modalDescription)}>
            We have sent a link to confirm your email to {email}
          </p>
          <Button type="button" onClick={handleOkClick}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  )
}
