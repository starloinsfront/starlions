"use client"
import s from "./Signup.module.css"
import Link from "next/link"
import {Button} from "@/common/components/Button/Button"
import {Icon} from "@/common/components/Icon/Icon"
import {TextField} from "@/common/components/TextField/TextField"

export default function Home() {
  return (
    <section className={s.registrationPage}>
      <div className={s.signupContainer}>
        <h1 className={s.singUpTitle}>Sign up</h1>
        <div className={s.authProviders}>
          <Icon className={s.authIcon} height={36} name={"googleFilled"} width={36}/>
          <Icon className={s.authIcon} height={36} name={"githubFilled"} width={36}/>
        </div>
        <form className={s.signupForm}>
          <TextField
            containerClassName={s.regItem}
            label={"Username"}
            placeholder={"Username"}
            autoComplete={"username"}
            type={"text"}
          />
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
            autoComplete={"new-password"}
            type={"password"}
          />
          <TextField
            containerClassName={s.regItem}
            label={"Password confirmation"}
            placeholder={"Password confirmation"}
            autoComplete={"new-password"}
            type={"password"}
          />
          <div className={s.consentContainer}>
            <input type={"checkbox"}/>
            <p className={s.consentText}>I agree to the
              <Link className={s.regLink} href='/termsofservice'> Terms of Service</Link> and
              <Link className={s.regLink} href='/privacypolicy'> Privacy Policy</Link>
            </p>
          </div>
          <Button className={s.submitButton} type={"submit"}>
            Sign Up
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
