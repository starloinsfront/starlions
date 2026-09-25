import type { ReactNode } from "react"

import { PublicAppLayout } from "@/widgets/AppLayout/PublicAppLayout"

type Props = Readonly<{
  children: ReactNode
}>

export default function MainLayout({ children }: Props) {
  return (
    <PublicAppLayout>
      {children}
    </PublicAppLayout>
  )
}
