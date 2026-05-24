"use client"

import s from "./Login.module.css"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/common/components/Button/Button"
import { Icon } from "@/common/components/Icon/Icon"
import { TextField } from "@/common/components/TextField/TextField"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormData, signInSchema } from "@/features/auth/model/auth-schemas"
import { useLoginMutation } from "@/features/auth/api/useLoginMutation"
import { ROUTES } from "@/common/constants/route"
import { GoogleOAuthLaunchLink } from "@/features/auth/ui/GoogleOAuthLaunchLink/GoogleOAuthLaunchLink"

function LoginPageContent() {
  const searchParams = useSearchParams()
  const oauthError = searchParams.get("error")

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  })

  const mutation = useLoginMutation(setError)

  const onSubmit = (data: SignInFormData) => {
    mutation.mutate(data)
  }

  return (
    <section className={s.loginPage}>
      <div className={s.loginContainer}>
        <p>Sign In</p>
        {oauthError ? (
          <p className={s.oauthError} role="alert">
            {oauthError}
          </p>
        ) : null}
        <div className={s.authProviders}>
          <GoogleOAuthLaunchLink
            ariaLabel="Sign in with Google"
            buttonClassName={s.googleOAuthButton}
            iconClassName={s.authIcon}
          />
          <Icon className={s.authIcon} height={36} name={"githubFilled"} width={36} />
        </div>
        <form className={s.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email")}
            errorMessage={errors.email?.message}
            containerClassName={s.regItem}
            label={"Email"}
            placeholder={"Email"}
            autoComplete={"email"}
            type={"email"}
          />

          <TextField
            {...register("password")}
            errorMessage={errors.password?.message}
            containerClassName={s.regItem}
            label={"Password"}
            placeholder={"Password"}
            autoComplete={"current-password"}
            type={"password"}
          />

          <Link href={ROUTES.forgotPassword} className={s.forgotPassword}>
            Forgot Password
          </Link>

          <Button
            disabled={!isValid || mutation.status === "pending"}
            className={s.submitButton}
            type={"submit"}
          >
            Sign In
          </Button>
        </form>
        <p className={s.authText}>Don&apos;t have an account?</p>
        <Link className={s.authLink} href={ROUTES.signUp}>
          Sign Up
        </Link>
      </div>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className={s.loginPage}>
          <div className={s.loginContainer}>
            <p>Sign In</p>
          </div>
        </section>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
