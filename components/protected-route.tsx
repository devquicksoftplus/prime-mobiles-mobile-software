"use client"

import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  
  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/admin", "/terms", "/privacy"]
  const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/admin")

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/80 via-background to-teal-50/40">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If it's a public path, render children
  if (isPublicPath) {
    return <>{children}</>
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Otherwise, return null (redirect will happen from AuthProvider)
  return null
}
