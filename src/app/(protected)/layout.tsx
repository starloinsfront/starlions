import { isAuthenticated } from "@/common/utils/isAuth"
import { AppLayout } from "@/widgets/AppLayout/AppLayout"
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
    <AppLayout isAuth withSidebar>
      {children}
    </AppLayout>
  )
}
