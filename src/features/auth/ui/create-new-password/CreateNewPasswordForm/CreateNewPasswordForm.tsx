"use client"

import { Button } from "@/common/components/Button/Button"
import { TextField } from "@/common/components/TextField/TextField"
import { passwordConfirmationSchema } from "@/features/auth/model/auth-schemas"
import clsx from "clsx"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
import styles from "./CreateNewPasswordForm.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect, useSearchParams } from "next/navigation"
import { ROUTES } from "@/common/constants/route"

export const createNewPasswordSchema = passwordConfirmationSchema

export type CreateNewPasswordFormValues = z.infer<typeof createNewPasswordSchema>

export const CreateNewPasswordForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams ? searchParams.get("token") : null

  if (!token) {
    redirect(ROUTES.forgotPassword)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewPasswordFormValues>({
    resolver: zodResolver(passwordConfirmationSchema),
    mode: "onChange",
  })

  const onSubmit: SubmitHandler<CreateNewPasswordFormValues> = (data) => {
    console.log(data.password)
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={clsx("h1", styles.title)}>Create New password</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.textFieldBox}>
          <TextField
            label="Password"
            id="password"
            type="password"
            placeholder="Password"
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <TextField
            label="Confirm password"
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            errorMessage={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <p className={clsx("regularText14", styles.description)}>
          Your password must be between 6 and 20 characters
        </p>
        <div className={styles.box}>
          <Button className={styles.sendButton} type="submit">
            Create new password
          </Button>
        </div>
      </form>
    </div>
  )
}
