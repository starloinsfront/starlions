import { isAuthenticated } from "@/common/utils/isAuth"
import { AppLayout } from "@/widgets/AppLayout/AppLayout"
import { ReactNode } from "react"

export default async function MainLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const isAuth = await isAuthenticated()

  return (
    <AppLayout isAuth={isAuth} withSidebar={isAuth} centered={!isAuth}>
      {children}
    </AppLayout>
  )
}
