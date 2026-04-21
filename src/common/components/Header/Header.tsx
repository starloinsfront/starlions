import Link from "next/link"
import { GuestActions } from "./GuestActions/GuestActions"
import s from "./Header.module.css"
import { UserActions } from "./UserActions/UserActions"

type Props = {
  isAuth?: boolean
}

export function Header({ isAuth = false }: Props) {
  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link href="/" className={s.logo}>
          Starlions
        </Link>

        <div className={s.right}>{isAuth ? <UserActions /> : <GuestActions />}</div>
      </div>
    </header>
  )
}
