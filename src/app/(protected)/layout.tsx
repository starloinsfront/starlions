import { ROUTES } from "@/common/constants/route"
import { isAuthenticated } from "@/common/utils/isAuth"
import { AppLayout } from "@/widgets/AppLayout/AppLayout"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuth = await isAuthenticated()

  if (!isAuth) {
    redirect(ROUTES.signIn)
  }

  return (
    <AppLayout isAuth withSidebar>
      {children}
    </AppLayout>
  )
}
