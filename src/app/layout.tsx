import QueryProvider from "@/app/providers/QueryProvider"
import type { Metadata } from "next"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"
import "./globals.css"
import { ToastProvider } from "./providers/ToastProvider/ToastProvider"

export const metadata: Metadata = {
  title: "Inctagram | Photo Sharing & Social Network",
  description:
    "Upload photos, follow friends, and explore content from creators around the world. Your visual story starts here.",
  icons: {
    icon: "/logo16x16.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}

          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  )
}
