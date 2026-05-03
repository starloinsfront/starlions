import { Header } from "@/widgets/Header/Header"
import "../globals.css"
import { Sidebar } from "@/widgets/Sidebar/Sidebar"
import { isAuthenticated } from "@/common/utils/isAuth"
import { redirect } from "next/navigation"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuth = isAuthenticated()

  if (!isAuth) {
    redirect("/login")
  }

  return (
    <div className="content">
      <Header isAuth={isAuth} />
      <div className="mainContent">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
    </div>
  )
}
