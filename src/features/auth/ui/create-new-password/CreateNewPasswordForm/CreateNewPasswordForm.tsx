"use client"

import { Button } from "@/common/components/Button/Button"
import { Loader } from "@/common/components/Loader/Loader"
import { TextField } from "@/common/components/TextField/TextField"
import { ROUTES } from "@/common/constants/route"
import { passwordConfirmationSchema } from "@/features/auth/model/auth-schemas"
import { useCreateNewPassword } from "@/features/auth/model/useCreateNewPassword"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"
import styles from "./CreateNewPasswordForm.module.css"

export const createNewPasswordSchema = passwordConfirmationSchema

export type CreateNewPasswordFormValues = z.infer<typeof createNewPasswordSchema>

export const CreateNewPasswordForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const recoveryCode = searchParams?.get("recoveryCode")

  useEffect(() => {
    if (!recoveryCode) {
      router.replace(ROUTES.forgotPassword)
    }
  }, [recoveryCode, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateNewPasswordFormValues>({
    resolver: zodResolver(passwordConfirmationSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      newPasswordConfirmation: "",
    },
  })

  const { mutate, isPending, isCooldownActive } = useCreateNewPassword<CreateNewPasswordFormValues>(
    {
      onSuccess: () => {
        router.push(ROUTES.signIn)
      },
    },
  )

  const onSubmit: SubmitHandler<CreateNewPasswordFormValues> = (data) => {
    const code = recoveryCode

    if (!code || isPending || isCooldownActive) {
      return
    }

    mutate({
      recoveryCode: code,
      newPassword: data.newPassword,
      newPasswordConfirmation: data.newPasswordConfirmation,
    })
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={clsx("h1", styles.title)}>Create New password</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.textFieldBox}>
          <input type="text" name="username" autoComplete="username" value="" readOnly hidden />
          <TextField
            label="Password"
            id="newPassword"
            type="password"
            placeholder="Password"
            errorMessage={errors.newPassword?.message}
            autoComplete="new-password"
            {...register("newPassword")}
          />
          <TextField
            label="Confirm password"
            id="newPasswordConfirmation"
            type="password"
            placeholder="Confirm password"
            errorMessage={errors.newPasswordConfirmation?.message}
            autoComplete="new-password"
            {...register("newPasswordConfirmation")}
          />
        </div>
        <p className={clsx("regularText14", styles.description)}>
          Your password must be between 6 and 20 characters
        </p>
        <div className={styles.box}>
          <Button
            className={styles.sendButton}
            type="submit"
            disabled={isPending || !isValid || isCooldownActive}
          >
            {isPending ? (
              <span style={{ height: "20px", width: "20px" }}>
                <Loader />
              </span>
            ) : (
              "Create new password"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
