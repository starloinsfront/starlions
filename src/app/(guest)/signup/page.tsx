"use client"

import s from "./Signup.module.css"
import Link from "next/link"
import { Button } from "@/common/components/Button/Button"
import { Icon } from "@/common/components/Icon/Icon"
import { TextField } from "@/common/components/TextField/TextField"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { RegisterFormData, registerSchema } from "@/app/(guest)/signup/register.schema"
import { zodResolver } from "@hookform/resolvers/zod"

export default function Home() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { register: registerUser, isLoading, error, reset: resetMutation } = useRegister()
  const { getErrorMessage } = useAuthError({ type: "registration" })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // валидация при каждом изменении
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSuccessMessage(null)
    resetMutation()

    try {
      registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        isTermsAccepted: data.isTermsAccepted,
      })

      setSuccessMessage(`We have sent a link to confirm your email to ${data.email}`)
      resetForm()

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

  const serverError = getErrorMessage(error)

  return (
    <section className={s.registrationPage}>
      <div className={s.signupContainer}>
        <h1 className={s.singUpTitle}>Sign up</h1>
        <div className={s.authProviders}>
          <Icon className={s.authIcon} height={36} name={"googleFilled"} width={36}/>
          <Icon className={s.authIcon} height={36} name={"githubFilled"} width={36}/>
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
            errorMessage={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <div className={s.consentContainer}>
            <input
              type="checkbox"
              id="termsCheckbox"
              disabled={isLoading}
              {...register("isTermsAccepted")}
            />
            <p className={s.consentText}>
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
            </p>
          </div>
          <Button className={s.submitButton} type={"submit"} disabled={!isValid || isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </Button>
        </form>
        <p className={s.authText}>Do you have an account?</p>
        <Link className={s.authLink} href="/login">
          Sign In
        </Link>
      </div>
    </section>
  )
}
