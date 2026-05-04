import { Header } from "@/widgets/Header/Header"
import "../globals.css"
import { isAuthenticated } from "@/common/utils/isAuth"
import { redirect } from "next/navigation"

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuth = isAuthenticated()

  if (isAuth) {
    redirect("/")
  }

  return (
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
