import clsx from "clsx"
import type { ReactNode } from "react"

import { Header } from "@/widgets/Header/Header"
import { Sidebar } from "@/widgets/Sidebar/Sidebar"
import { ToastLayoutSync } from "@/app/providers/ToastProvider/ToastLayoutSync"

type AppLayoutProps = {
  children: ReactNode
  isAuth?: boolean
  withSidebar?: boolean
  centered?: boolean
}

export const AppLayout = ({
  children,
  isAuth = false,
  withSidebar = false,
  centered = false,
}: AppLayoutProps) => {
  return (
    <>
      <ToastLayoutSync withSidebar={withSidebar} />
      <div className="content">
        <Header isAuth={isAuth} />

        <div className={clsx("mainContent", !withSidebar && "mainContentWithoutSidebar")}>
          {withSidebar && <Sidebar />}

          <main className="main">
            <div className={clsx("mainInner", centered && "mainInnerWithoutSidebar")}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
