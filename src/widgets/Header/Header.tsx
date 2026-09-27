"use client"

import Link from "next/link"

import { Skeleton } from "@/common/components/Skeleton/Skeleton"

import { GuestActions } from "./GuestActions/GuestActions"
import styles from "./Header.module.css"
import { UserActions } from "./UserActions/UserActions"

type Props = {
  isAuth?: boolean
  isAuthLoading?: boolean
}

const HeaderActionsSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Checking authorization"
      className={styles.actionsSkeleton}
      role="status"
    >
      <Skeleton className={styles.notificationSkeleton} />
      <Skeleton className={styles.languageSkeleton} />
      <Skeleton className={styles.menuSkeleton} />
    </div>
  )
}

export function Header({ isAuth = false, isAuthLoading = false }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Inctagram
        </Link>

        <div className={styles.right}>
          {isAuthLoading ? (
            <HeaderActionsSkeleton />
          ) : isAuth ? (
            <UserActions />
          ) : (
            <GuestActions />
          )}
        </div>
      </div>
    </header>
  )
}
