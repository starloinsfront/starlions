import type { ReactNode } from "react"

import { ProtectedAppLayout } from "@/widgets/AppLayout/ProtectedAppLayout"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <ProtectedAppLayout>{children}</ProtectedAppLayout>
}
