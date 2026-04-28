"use client"

import { TextField } from "@/common/components/TextField/TextField"
import styles from "./ForgotPasswordForm.module.css"
import { clsx } from "clsx"
import { Button } from "@/common/components/Button/Button"
import Link from "next/link"
import { ROUTES } from "@/common/constants/route"
import { Modal } from "@/common/components/Modal/Modal"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type ForgotPasswordFormValues = {
  email: string
}

export const ForgotPasswordForm = () => {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>()

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
    console.log(data.email)
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
          Enter your email address and we will send you further instructions{" "}
        </p>
        <div className={styles.box}>
          <Button className={styles.sendButton} type="button" onClick={() => setOpen(true)}>
            Send link
          </Button>
          <Button variant="link" className={styles.sendButton} asChild>
            <Link href={ROUTES.signIn}>Back to Sign In</Link>
          </Button>
        </div>
      </form>
      <Modal modalTitle="Email sent" onClose={() => setOpen(false)} open={open} size="sm">
        <div className={styles.dialog}>
          <p className={clsx("regularText16", styles.modalDescription)}>
            We have sent a link to confirm your email to epam@epam.com
          </p>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </div>
      </Modal>
    </div>
  )
}
