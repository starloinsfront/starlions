import { isAuthenticated } from "@/common/utils/isAuth"
import { AppLayout } from "@/widgets/AppLayout/AppLayout"
import { ReactNode } from "react"

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const isAuth = isAuthenticated()

  return (
    <AppLayout isAuth={isAuth} withSidebar={isAuth} centered={!isAuth}>
      {children}
    </AppLayout>
  )
}
