"use client"

import Link from "next/link"
import { GuestActions } from "./GuestActions/GuestActions"
import styles from "./Header.module.css"
import { LanguageSelect } from "./LanguageSelect/LanguageSelect"
import { UserActions } from "./UserActions/UserActions"

type Props = {
  isAuth?: boolean
  isAuthLoading?: boolean
}

export function Header({ isAuth = false, isAuthLoading = false }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Inctagram
        </Link>

        <div className={styles.right}>
          {isAuthLoading ? <LanguageSelect /> : isAuth ? <UserActions /> : <GuestActions />}
        </div>
      </div>
    </header>
  )
}
