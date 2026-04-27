import Link from "next/link"
import { GuestActions } from "./GuestActions/GuestActions"
import styles from "./Header.module.css"
import { UserActions } from "./UserActions/UserActions"

type Props = {
  isAuth?: boolean
}

export function Header({ isAuth = false }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Starlions
        </Link>

        <div className={styles.right}>{isAuth ? <UserActions /> : <GuestActions />}</div>
      </div>
    </header>
  )
}
