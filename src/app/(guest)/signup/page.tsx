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
import { GoogleOAuthLaunchLink } from "@/features/auth/ui/GoogleOAuthLaunchLink/GoogleOAuthLaunchLink"

import { useRegistration } from "@/features/auth/api/useRegistration"

export default function Home() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      isTermsAccepted: false,
    },
  })
  const { mutate, isPending } = useRegistration(setError)

  const onSubmit = (data: RegisterFormData) => {
    mutate(data, {
      onSuccess: () => {
        setRegisteredEmail(data.email)
        setIsModalOpen(true)
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
          <GoogleOAuthLaunchLink
            ariaLabel="Sign up with Google"
            buttonClassName={s.googleOAuthButton}
            iconClassName={s.authIcon}
          />
          <Icon className={s.authIcon} height={36} name={"githubFilled"} width={36} />
        </div>
        <form className={s.signupForm} onSubmit={handleSubmit(onSubmit)}>
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
                disabled={isPending}
                {...register("isTermsAccepted")}
              />
              <span className={s.consentText}>
                I agree to the
                <Link className={s.regLink} href={ROUTES.termsOfService}>
                  {" "}
                  Terms of Service
                </Link>{" "}
                and
                <Link className={s.regLink} href={ROUTES.privacyPolicy}>
                  {" "}
                  Privacy Policy
                </Link>
              </span>
            </label>
            <span className={s.consentError}>{errors.isTermsAccepted?.message || "\u00A0"}</span>
          </div>

          {errors.root?.message && (
            <span className={s.consentError} role="alert">
              {errors.root.message}
            </span>
          )}

          <Button className={s.submitButton} type={"submit"} disabled={!isValid || isPending}>
            {isPending ? "Loading..." : "Sign Up"}
          </Button>
        </form>

        <p className={s.authText}>Do you have an account?</p>
        <Link className={s.authLink} href={ROUTES.signIn}>
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
