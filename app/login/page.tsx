"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Wrench, ArrowLeft, Shield, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AuthCarousel } from "@/components/auth-carousel"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Auth context will handle redirect based on user role
      // (admin -> /admin/dashboard, user -> /dashboard)
    } else {
      setError(result.error || "Invalid email or password")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Fixed Carousel (Not Scrollable) */}
      <AuthCarousel />

      {/* Right Side - Form (Scrollable if needed) */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto bg-background">
        <div className="min-h-full flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Link href="/" className="flex items-center gap-3">
                <img src="/konnect-logo.png" alt="Konnect" className="h-24 w-auto" />
              </Link>
            </div>

            {/* Back link */}
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your repair shop dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    autoComplete="current-password"
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-6">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground text-center">500+ Shops</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground text-center">24/7 Access</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground text-center">Secure</span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="pt-6 border-t border-border/50 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Create one
                </Link>
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
