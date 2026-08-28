"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Wrench, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCarousel } from "@/components/auth-carousel"
import { useAuth } from "@/contexts/auth-context"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await resetPassword(email)
    
    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || "Failed to send reset email")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Carousel */}
      <AuthCarousel />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
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
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          {success ? (
            /* Success State */
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Check your email
                </h1>
                <p className="text-muted-foreground">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      Click the link in the email to reset your password. If you don&apos;t see 
                      the email, check your spam folder.
                    </p>
                    <p>
                      The link will expire in 1 hour.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                >
                  Try a different email
                </Button>
                <Link href="/login" className="block">
                  <Button className="w-full h-11">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Reset your password
                </h1>
                <p className="text-muted-foreground">
                  Enter the email address associated with your account and we&apos;ll send you a 
                  link to reset your password.
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
              
              {/* Footer */}
              <div className="pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
