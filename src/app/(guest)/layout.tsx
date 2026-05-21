import { ROUTES } from "@/common/constants/route"
import { isAuthenticated } from "@/common/utils/isAuth"
import { AppLayout } from "@/widgets/AppLayout/AppLayout"
import { redirect } from "next/navigation"
export default async function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuth = await isAuthenticated()

  if (isAuth) {
    redirect(ROUTES.home)
  }

  return <AppLayout centered>{children}</AppLayout>
}
