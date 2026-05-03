import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReactNode } from "react"
import StoreProvider from "@/app/StoreProvider"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

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
  children: ReactNode
}>) {
  return (
    <StoreProvider>
      <html lang="en" className={inter.variable}>
        <body>{children}</body>
      </html>
    </StoreProvider>
  )
}
