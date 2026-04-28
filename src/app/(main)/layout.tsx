import { isAuthenticated } from "@/common/utils/isAuth"
import "../globals.css"
import { Header } from "@/widgets/Header/Header"
import { Sidebar } from "@/widgets/Sidebar/Sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuth = isAuthenticated()

  return isAuth ? (
    <div className="content">
      <Header isAuth={isAuth} />
      <div className="mainContent">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
    </div>
  ) : (
    <div className="content">
      <Header isAuth={isAuth} />
      <main className="main">{children}</main>
    </div>
  )
}
