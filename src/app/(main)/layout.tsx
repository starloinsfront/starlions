import { isAuthenticated } from "@/common/utils/isAuth"
import "../globals.css"
import { Header } from "@/widgets/Header/Header"
import { Sidebar } from "@/widgets/Sidebar/Sidebar"
import { ReactNode } from "react"

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const isAuth = isAuthenticated()

  return isAuth ? (
    <div className="content">
      <Header isAuth={isAuth} />
      <div className="mainContent">
        <Sidebar />
        <main className="main">
          <div className="mainInner">{children}</div>
        </main>
      </div>
    </div>
  ) : (
    <div className="content">
      <Header isAuth={isAuth} />
      <div className="mainContent mainContentWithoutSidebar">
        <main className="main">
          <div className="mainInner mainInnerWithoutSidebar">{children}</div>
        </main>
      </div>
    </div>
  )
}
