"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Shield, Loader2 } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // If authenticated but not an admin, redirect to dashboard
    if (user && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [user, isLoading, isAuthenticated, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not admin (brief flash before redirect)
  if (!isAuthenticated || (user && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />
      
      {/* Main Content */}
      <main className={cn("lg:ml-64 min-h-screen transition-all duration-300")}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="px-4 lg:px-8 py-4">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
