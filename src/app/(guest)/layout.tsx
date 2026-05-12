import { isAuthenticated } from "@/common/utils/isAuth"
import { AppLayout } from "@/widgets/AppLayout/AppLayout"
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

  return <AppLayout centered>{children}</AppLayout>
}
