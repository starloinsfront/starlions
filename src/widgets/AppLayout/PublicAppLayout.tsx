"use client"

import clsx from "clsx"
import { type ReactNode } from "react"

import { ToastLayoutSync } from "@/app/providers/ToastProvider/ToastLayoutSync"
import { useMe } from "@/features/auth/api/useMe"
import { Header } from "@/widgets/Header/Header"
import { Sidebar, SidebarSkeleton } from "@/widgets/Sidebar/Sidebar"

type PublicAppLayoutProps = {
  children: ReactNode
}

export const PublicAppLayout = ({ children }: PublicAppLayoutProps) => {
  const { data: me, isPending } = useMe()
  const isAuth = Boolean(me?.id)
  const isAuthLoading = isPending && !me
  const showSidebarArea = isAuth || isAuthLoading

  return (
    <>
      <ToastLayoutSync withSidebar={showSidebarArea} />
      <div className="content">
        <Header isAuth={isAuth} isAuthLoading={isAuthLoading} />

        <div className={clsx("mainContent", !showSidebarArea && "mainContentWithoutSidebar")}>
          {isAuthLoading ? <SidebarSkeleton /> : isAuth ? <Sidebar /> : null}

          <main className="main">
            <div className={clsx("mainInner", !showSidebarArea && "mainInnerWithoutSidebar")}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
