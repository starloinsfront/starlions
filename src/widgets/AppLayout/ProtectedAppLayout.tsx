"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/common/components/Button/Button"
import { Skeleton } from "@/common/components/Skeleton/Skeleton"
import { ROUTES } from "@/common/constants/route"
import { useMe } from "@/features/auth/api/useMe"
import { ToastLayoutSync } from "@/app/providers/ToastProvider/ToastLayoutSync"
import { Header } from "@/widgets/Header/Header"
import { Sidebar, SidebarSkeleton } from "@/widgets/Sidebar/Sidebar"

import s from "./ProtectedAppLayout.module.css"

type Props = {
  children: ReactNode
}

const ProtectedContentSkeleton = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading protected page"
      className={s.contentSkeleton}
      role="status"
    >
      <Skeleton className={s.titleSkeleton} />
      <Skeleton className={s.tabsSkeleton} />
      <Skeleton className={s.blockSkeleton} />
    </div>
  )
}

export const ProtectedAppLayout = ({ children }: Props) => {
  const router = useRouter()
  const { data: me, isError, isPending, refetch } = useMe()
  const isAuthenticated = Boolean(me?.id)
  const hasBlockingError = isError && !isAuthenticated
  const isWaitingForAuth = !isAuthenticated && !hasBlockingError

  useEffect(() => {
    if (!isPending && !isError && !me?.id) {
      router.replace(ROUTES.signIn)
    }
  }, [isError, isPending, me?.id, router])

  return (
    <>
      <ToastLayoutSync withSidebar />
      <div className="content">
        <Header isAuth={isAuthenticated} isAuthLoading={!isAuthenticated} />

        <div className="mainContent">
          {isAuthenticated ? <Sidebar /> : <SidebarSkeleton />}

          <main className="main">
            <div className="mainInner">
              {hasBlockingError ? (
                <div className={s.errorState} role="alert">
                  <p>Failed to verify your account.</p>
                  <Button onClick={() => void refetch()} type="button" variant="secondary">
                    Try again
                  </Button>
                </div>
              ) : isWaitingForAuth ? (
                <ProtectedContentSkeleton />
              ) : (
                children
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
