import type React from "react"
// <CHANGE> Updated metadata for repair billing system
import type { Metadata } from "next"
import { Public_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { CompanyProvider } from "@/contexts/company-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const publicSans = Public_Sans({ 
  subsets: ["latin"],
  variable: "--font-public-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Konnect - Device Repair Billing",
  description: "Manage device repairs, customer information, and billing",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <CompanyProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </CompanyProvider>
        </AuthProvider>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            className: "rounded-xl",
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
