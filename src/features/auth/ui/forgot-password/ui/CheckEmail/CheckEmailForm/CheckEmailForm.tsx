"use client"

import { Button } from "@/common/components/Button/Button"
import { Modal } from "@/common/components/Modal/Modal"
import { TextField } from "@/common/components/TextField/TextField"
import { ROUTES } from "@/common/constants/route"
import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import Link from "next/link"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import styles from "./CheckEmailForm.module.css"
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "../../ForgotPasswordForm/ForgotPasswordForm"

export const CheckEmailForm = () => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")

  const {
    register,
    handleSubmit,
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
          <Button className={styles.sendButton} type="submit" disabled={!isValid || isSubmitting}>
            Send Link Again
          </Button>
          <Button variant="link" className={styles.sendButton} asChild>
            <Link href={ROUTES.signIn}>Back to Sign In</Link>
          </Button>
        </div>
      </form>
      {open && (
        <Modal modalTitle="Email sent" onClose={() => setOpen(false)} open={open} size="sm">
          <div className={styles.dialog}>
            <p className={clsx("regularText16", styles.modalDescription)}>
              We have sent a link to confirm your email to {email}
            </p>
            <Button onClick={() => setOpen(false)}>OK</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
