"use client"
import s from "./Login.module.css"
import Link from "next/link"
import {Button} from "@/common/components/Button/Button"
import {Icon} from "@/common/components/Icon/Icon"
import {TextField} from "@/common/components/TextField/TextField"

export default function LoginPage() {
  return (
    <section className={s.loginPage}>
      <div className={s.loginContainer}>
        <p>Sign In</p>
        <div className={s.authProviders}>
          <Icon className={s.authIcon} height={36} name={"googleFilled"} width={36}/>
          <Icon className={s.authIcon} height={36} name={"githubFilled"} width={36}/>
        </div>
        <form className={s.loginForm}>
          <TextField
            containerClassName={s.regItem}
            label={"Email"}
            placeholder={"Email"}
            autoComplete={"email"}
            type={"email"}
          />
          <TextField
            containerClassName={s.regItem}
            label={"Password"}
            placeholder={"Password"}
            autoComplete={"current-password"}
            type={"password"}
          />
          <Link href='/forgotpassword' className={s.forgotPassword}>Forgot Password</Link>
          <Button className={s.submitButton} type={"submit"}>
            Sign In
          </Button>
        </form>
        <p className={s.authText}>Don&apos;t have an account?</p>
        <Link className={s.authLink} href="/singup">
          Sign Up
        </Link>
      </div>
    </section>
  )
}
