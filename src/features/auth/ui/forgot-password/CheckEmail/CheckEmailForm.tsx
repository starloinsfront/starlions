"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import Link from "next/link"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/common/components/Button/Button"
import { Loader } from "@/common/components/Loader/Loader"
import { TextField } from "@/common/components/TextField/TextField"
import { ROUTES } from "@/common/constants/route"
import { emailSchema } from "@/features/auth/model/auth-schemas"
import { usePasswordRecoveryResend } from "@/features/auth/model/usePasswordRecoveryResend"
import { EmailSentModal } from "../EmailSentModal/EmailSentModal"
import styles from "./CheckEmailForm.module.css"

export const checkEmailSchema = z.object({
  email: emailSchema,
})

export type CheckEmailFormValues = z.infer<typeof checkEmailSchema>

export const CheckEmailForm = () => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<CheckEmailFormValues>({
    resolver: zodResolver(checkEmailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  const { mutate, isPending, isCooldownActive } = usePasswordRecoveryResend<CheckEmailFormValues>({
    setError,
    onSuccess: (email) => {
      setEmail(email)
      setOpen(true)
    },
  })

  const onSubmit: SubmitHandler<CheckEmailFormValues> = (data) => {
    mutate(data)
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
        <p className={clsx("regularText14", styles.twoDescription)}>
          The link has been sent by email. If you don’t receive an email send link again
        </p>
        <div className={styles.box}>
          <Button
            className={styles.sendButton}
            type="submit"
            disabled={!isValid || isPending || isCooldownActive}
          >
            {isPending ? (
              <span style={{ height: "20px", width: "20px" }}>
                <Loader />
              </span>
            ) : (
              "Send Link Again"
            )}
          </Button>
          <Button variant="link" className={styles.sendButton} asChild>
            <Link href={ROUTES.signIn}>Back to Sign In</Link>
          </Button>
        </div>
      </form>
      {open && <EmailSentModal email={email} onClose={() => setOpen(false)} open={open} />}
    </div>
  )
}
