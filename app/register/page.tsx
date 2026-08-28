"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Wrench, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AuthCarousel } from "@/components/auth-carousel"

const benefits = [
  "Job card management & tracking",
  "Professional invoice generation",
  "Customer history & analytics",
  "WhatsApp invoice sharing"
]

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      shopName: formData.shopName || undefined,
      phone: formData.phone || undefined,
    })
    
    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Failed to create account")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Fixed Carousel (Not Scrollable) */}
      <AuthCarousel />

      {/* Right Side - Form (Scrollable) - WHITE BACKGROUND */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto bg-white">
        <div className="min-h-full flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6">
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
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Create your account
              </h1>
              <p className="text-gray-500">
                Start your free trial today. No credit card required.
              </p>
            </div>

            {/* Benefits - Mobile only */}
            <div className="lg:hidden space-y-2 p-4 rounded-xl bg-blue-50 border border-blue-100">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    autoComplete="name"
                    className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopName" className="text-gray-700">Shop Name</Label>
                  <Input
                    id="shopName"
                    type="text"
                    placeholder="QuickFix Mobile"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    autoComplete="organization"
                    className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  autoComplete="tel"
                  className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      autoComplete="new-password"
                      className="h-11 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    autoComplete="new-password"
                    className="h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </form>
            
            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <Link href="/terms" className="hover:text-gray-600 transition-colors">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-gray-600 transition-colors">
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
