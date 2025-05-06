
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from 'next/script';
import Header from "@/components/header"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import BotpressScripts from '@/components/BotpressScripts';

const inter = Inter({ subsets: ["latin"] })

declare global {
  interface Window {
    botpressWebChat?: {
      init: (config: any) => void;
    };
  }
}

export const metadata: Metadata = {
  title: "HighTEx - Cửa hàng điện tử",
  description: "Cửa hàng điện tử HighTEx",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="vi">
      <head>
        <Script src="https://cdn.botpress.cloud/webchat/v2.4/inject.js" strategy="afterInteractive" />
        <Script src="https://files.bpcontent.cloud/2025/05/06/19/20250506192554-ZZOZ4FKA.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <Navbar />
          {children}
          <BotpressScripts />
        </ThemeProvider>
      </body>
    </html>
  )
}

