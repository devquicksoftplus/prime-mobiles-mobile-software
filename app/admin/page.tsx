"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isLoading) return

    // If user is an admin, redirect to admin dashboard
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin/dashboard")
    }
  }, [user, isLoading, isAuthenticated, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Checking admin access...</p>
        </div>
      </div>
    )
  }

  // If user is admin, show loading (will redirect)
  if (isAuthenticated && user?.role === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Redirecting to admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users or login prompt
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <Card className="w-full max-w-md rounded-3xl shadow-xl border-slate-200 bg-white relative z-10">
        <CardHeader className="text-center pb-2">
          <div className={`mx-auto mb-6 w-20 h-20 ${isAuthenticated ? 'bg-red-50' : 'bg-gradient-to-br from-indigo-500 to-purple-600'} rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
            <Shield className={`w-10 h-10 ${isAuthenticated ? 'text-red-500' : 'text-white'}`} />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">
            {isAuthenticated ? 'Access Denied' : 'Admin Portal'}
          </CardTitle>
          <CardDescription className="text-slate-500 text-base mt-2">
            {isAuthenticated 
              ? "You don't have admin privileges. Contact an administrator for access."
              : 'Please sign in with an admin account to continue.'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900" variant="outline">
                Go to User Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                Sign In
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
