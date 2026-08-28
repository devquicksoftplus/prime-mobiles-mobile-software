"use client"

import { useState } from "react"
import { AlertTriangle, Mail, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function EmailVerificationBanner() {
  const { user, resendVerificationEmail } = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Don't show banner if user is verified, dismissed, or not logged in
  if (!user || user.emailVerified || dismissed) {
    return null
  }

  const handleResend = async () => {
    setIsLoading(true)
    setMessage(null)
    
    const result = await resendVerificationEmail()
    
    if (result.success) {
      setMessage({ type: "success", text: "Verification email sent! Please check your inbox." })
    } else {
      setMessage({ type: "error", text: result.error || "Failed to send email" })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Please verify your email address
              </p>
              <p className="text-xs text-amber-700">
                We sent a verification link to <span className="font-medium">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {message && (
              <div className={`flex items-center gap-1 text-xs ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {message.type === "success" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>{message.text}</span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isLoading}
              className="bg-white border-amber-300 hover:bg-amber-50 text-amber-700 hover:text-amber-800"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Mail className="w-4 h-4 mr-1" />
              )}
              Resend Email
            </Button>
            
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
