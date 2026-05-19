import { isAuthenticated } from "@/common/utils/isAuth"
import { AppLayout } from "@/widgets/AppLayout/AppLayout"
import { NotFoundView } from "@/widgets/NotFoundView/NotFoundView"

export default async function NotFound() {
  const isAuth = await isAuthenticated()

  return (
    <AppLayout isAuth={isAuth} withSidebar={isAuth} centered={!isAuth}>
      <NotFoundView />
    </AppLayout>
  )
}
