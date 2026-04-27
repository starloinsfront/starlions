import { Header } from "../../widgets/Header/Header"
import "../globals.css"
import { isAuthenticated } from "@/common/utils/isAuth"
import { redirect } from "next/navigation"

export default function RootLayout({
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
      <main className="main">{children}</main>
    </div>
  )
}
