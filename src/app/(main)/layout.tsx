import { Suspense, type ReactNode } from "react"

import { PublicAppLayout } from "@/widgets/AppLayout/PublicAppLayout"
import { PostModalSearchParamsController } from "@/features/posts/ui/PostDetail/PostModalSearchParamsController"

type Props = Readonly<{
  children: ReactNode
}>

export default function MainLayout({ children }: Props) {
  return (
    <PublicAppLayout>
      {children}
      <Suspense fallback={null}>
        <PostModalSearchParamsController />
      </Suspense>
    </PublicAppLayout>
  )
}
