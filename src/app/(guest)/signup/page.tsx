"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/common/components/Button/Button"
import { Icon } from "@/common/components/Icon/Icon"
import { TextField } from "@/common/components/TextField/TextField"

import { RegisterFormData, registerSchema } from "@/features/auth/model/register.schema"
import s from "./Signup.module.css"
import { Modal } from "@/common/components/Modal/Modal"
import { ROUTES } from "@/common/constants/route"

import { useRegistration } from "@/features/auth/api/useRegistration"

export default function Home() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const mutation = useRegistration()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
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

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data, {
      onSuccess: (res) => {
        setRegisteredEmail(data.email)
        setIsModalOpen(true)
        resetForm()
      },
      onError: (err) => {
        console.log(err)
      },
    })
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    router.push(ROUTES.signIn)
  }
  return (
    <section className={s.registrationPage}>
      <div className={s.signupContainer}>
        <h1 className={s.singUpTitle}>Sign up</h1>
        <div className={s.authProviders}>
          <Icon className={s.authIcon} height={36} name={"googleFilled"} width={36} />
          <Icon className={s.authIcon} height={36} name={"githubFilled"} width={36} />
        </div>
        <form className={s.signupForm} onSubmit={handleSubmit(onSubmit)}>
          {successMessage && (
            <div className={s.formMessage} role="status">
              {successMessage}
            </div>
          )}

          <TextField
            containerClassName={s.regItem}
            label={"Username"}
            placeholder={"Username"}
            autoComplete={"username"}
            type={"text"}
            errorMessage={errors.username?.message}
            {...register("username")}
          />
          <TextField
            containerClassName={s.regItem}
            label={"Email"}
            placeholder={"Email"}
            autoComplete={"email"}
            type={"email"}
            errorMessage={errors.email?.message}
            {...register("email")}
          />
          <TextField
            containerClassName={s.regItem}
            label={"Password"}
            placeholder={"Password"}
            autoComplete={"new-password"}
            type={"password"}
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <TextField
            containerClassName={s.regItem}
            label={"Password confirmation"}
            placeholder={"Password confirmation"}
            autoComplete={"new-password"}
            type={"password"}
            errorMessage={errors.passwordConfirmation?.message}
            {...register("passwordConfirmation")}
          />

          <div className={s.consentBlock}>
            <label className={s.consentContainer} htmlFor="termsCheckbox">
              <input
                type="checkbox"
                id="termsCheckbox"
                className={s.termsCheckbox}
                disabled={mutation.isPending}
                {...register("isTermsAccepted")}
              />
              <span className={s.consentText}>
                I agree to the
                <Link className={s.regLink} href="/termsofservice">
                  {" "}
                  Terms of Service
                </Link>{" "}
                and
                <Link className={s.regLink} href="/privacypolicy">
                  {" "}
                  Privacy Policy
                </Link>
              </span>
            </label>
            <span className={s.consentError}>{errors.isTermsAccepted?.message || "\u00A0"}</span>
          </div>

          <Button
            className={s.submitButton}
            type={"submit"}
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? "Loading..." : "Sign Up"}
          </Button>
        </form>
        <p className={s.authText}>Do you have an account?</p>
        <Link className={s.authLink} href="/login">
          Sign In
        </Link>
      </div>
      <Modal open={isModalOpen} onClose={handleModalClose} modalTitle="Email sent">
        <div className={s.modalContent}>
          <p className={s.modalText}>
            We have sent a link to confirm your email to {registeredEmail}
          </p>
          <Button className={s.modalButton} onClick={handleModalClose}>
            OK
          </Button>
        </div>
      </Modal>
    </section>
  )
}
