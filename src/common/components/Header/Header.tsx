import Link from "next/link"
import { Button } from "@/common/components/Button/Button"
import s from "./Header.module.css"

export const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link className={s.logo} href="/">
          Inctagram
        </Link>

        <div className={s.controls}>
          <Button className={s.signup} variant="secondary">
            Language
          </Button>
          <nav aria-label="Authentication" className={s.auth}>
            <Link className={s.login} href="/login">
              Log in
            </Link>
            <Button className={s.signup} variant="primary">
              Sign up
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
