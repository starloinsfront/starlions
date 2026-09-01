"use client"

import clsx from "clsx"
import { type ReactNode } from "react"

import { ToastLayoutSync } from "@/app/providers/ToastProvider/ToastLayoutSync"
import { useMe } from "@/features/auth/api/useMe"
import { Header } from "@/widgets/Header/Header"
import { Sidebar } from "@/widgets/Sidebar/Sidebar"

type PublicAppLayoutProps = {
  children: ReactNode
}

export const PublicAppLayout = ({ children }: PublicAppLayoutProps) => {
  const { data: me, isPending } = useMe()
  const isAuth = Boolean(me?.id)
  const isAuthLoading = isPending && !me

  return (
    <>
      <ToastLayoutSync withSidebar={isAuth} />
      <div className="content">
        <Header isAuth={isAuth} isAuthLoading={isAuthLoading} />

        <div className={clsx("mainContent", !isAuth && "mainContentWithoutSidebar")}>
          {isAuth && <Sidebar />}

          <main className="main">
            <div className={clsx("mainInner", !isAuth && "mainInnerWithoutSidebar")}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
