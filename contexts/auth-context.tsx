"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export interface UserSubscription {
  planId: "basic" | "pro" | "elite" | null
  status: "active" | "expired" | "cancelled" | "trial"
  startDate: string
  endDate: string
  paymentId?: string
}

export interface User {
  uid: string
  email: string
  emailVerified: boolean
  name: string
  role: "user" | "admin"
  shopName?: string
  phone?: string
  createdAt: Date
  subscription?: UserSubscription
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

interface UpdateProfileData {
  name?: string
  shopName?: string
  phone?: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  shopName?: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default super admin email - this user will automatically get admin role when registering
const DEFAULT_SUPER_ADMIN_EMAIL = "quicksoftplus@gmail.com"

// Super admin email(s) - users registering with these emails automatically get admin role
// Can also use environment variable NEXT_PUBLIC_SUPER_ADMIN_EMAILS (comma-separated) for additional admins
const envAdminEmails = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean)
const SUPER_ADMIN_EMAILS = [DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase(), ...envAdminEmails]

// Helper to check if an email is a super admin
const isSuperAdminEmail = (email: string): boolean => {
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)
        // Fetch user data from Firestore
        const userData = await getUserData(firebaseUser.uid)
        if (userData) {
          setUser(userData)
          // Set admin token for admin API access if user is admin
          if (userData.role === "admin") {
            // Use Firebase ID token for admin API authentication
            const idToken = await firebaseUser.getIdToken()
            localStorage.setItem("adminToken", idToken)
          } else {
            localStorage.removeItem("adminToken")
          }
        } else {
          // If no user document exists, create a basic one
          const basicUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            emailVerified: firebaseUser.emailVerified,
            name: firebaseUser.displayName || "User",
            role: "user",
            createdAt: new Date(),
          }
          try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "User",
              role: "user",
              createdAt: new Date(),
            })
          } catch (error) {
            console.error("Error creating user document:", error)
          }
          setUser(basicUser)
          localStorage.removeItem("adminToken")
        }
      } else {
        setFirebaseUser(null)
        setUser(null)
        localStorage.removeItem("adminToken")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Redirect logic based on auth status and subscription
    if (!isLoading) {
      const publicPaths = ["/", "/login", "/register", "/forgot-password", "/terms", "/privacy"]
      const isPublicPath = publicPaths.includes(pathname)
      const isSubscriptionPath = pathname === "/subscription"
      
      // Admin paths have their own authentication - don't interfere
      const isAdminPath = pathname.startsWith("/admin")
      if (isAdminPath) {
        return // Skip all auth redirects for admin routes
      }

      if (!user && !isPublicPath) {
        router.push("/")
      } else if (user) {
        // Check if user has an active subscription
        const hasActiveSubscription = 
          user.subscription?.status === "active" || 
          user.subscription?.status === "trial"
        
        if (isPublicPath && pathname !== "/dashboard") {
          // Logged in user on public path - redirect appropriately
          if (user.role === "admin") {
            router.push("/admin/dashboard")
          } else if (!hasActiveSubscription) {
            // New user without subscription - go to subscription page
            router.push("/subscription")
          } else {
            router.push("/dashboard")
          }
        } else if (!hasActiveSubscription && !isSubscriptionPath && user.role !== "admin") {
          // User without subscription trying to access protected pages - redirect to subscription
          router.push("/subscription")
        }
      }
    }
  }, [user, isLoading, pathname, router])

  const getUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        // Get emailVerified from Firebase Auth, not Firestore
        const currentFirebaseUser = auth.currentUser
        return {
          uid: userDoc.id,
          email: data.email,
          emailVerified: currentFirebaseUser?.emailVerified ?? false,
          name: data.name,
          role: data.role || "user",
          shopName: data.shopName,
          phone: data.phone,
          createdAt: data.createdAt?.toDate() || new Date(),
          subscription: data.subscription || null,
        }
      }
      return null
    } catch (error) {
      console.error("Error fetching user data:", error)
      return null
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userData = await getUserData(userCredential.user.uid)
      if (userData) {
        setUser(userData)
        
        // Log login activity for admin tracking
        try {
          await fetch("/api/admin/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userData.uid,
              userName: userData.name,
              userEmail: userData.email,
              action: "login",
              userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
            }),
          })
        } catch (activityError) {
          // Don't fail login if activity logging fails
          console.warn("Failed to log login activity:", activityError)
        }
      }
      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "Invalid email or password"
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email"
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later"
      }
      return { success: false, error: errorMessage }
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)

      // Check if this email should be a super admin
      const userRole = isSuperAdminEmail(data.email) ? "admin" : "user"

      const newUser: User = {
        uid: userCredential.user.uid,
        email: data.email,
        emailVerified: false, // New users are not verified yet
        name: data.name,
        role: userRole,
        shopName: data.shopName,
        phone: data.phone,
        createdAt: new Date(),
      }

      // Build Firestore document - only include defined values
      // Firestore doesn't accept undefined values
      const userDoc: Record<string, any> = {
        uid: userCredential.user.uid,
        email: data.email,
        name: data.name,
        role: userRole,
        createdAt: new Date(),
      }
      
      // Only add optional fields if they have values
      if (data.shopName) {
        userDoc.shopName = data.shopName
      }
      if (data.phone) {
        userDoc.phone = data.phone
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), userDoc)

      // Send email verification link (FREE Firebase feature)
      try {
        await sendEmailVerification(userCredential.user)
      } catch (verificationError) {
        console.warn("Failed to send verification email:", verificationError)
        // Don't fail registration if verification email fails
      }

      setUser(newUser)
      return { success: true }
    } catch (error: any) {
      console.error("Registration error:", error)
      let errorMessage = "Failed to create account"
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address"
      }
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setFirebaseUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error: any) {
      console.error("Password reset error:", error)
      let errorMessage = "Failed to send password reset email"
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later"
      }
      return { success: false, error: errorMessage }
    }
  }

  const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    try {
      const updateData: Record<string, any> = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.shopName !== undefined) updateData.shopName = data.shopName
      if (data.phone !== undefined) updateData.phone = data.phone

      // Update Firestore document
      await setDoc(doc(db, "users", user.uid), updateData, { merge: true })

      // Update local user state
      setUser({
        ...user,
        ...updateData,
      })

      return { success: true }
    } catch (error: any) {
      console.error("Profile update error:", error)
      return { success: false, error: "Failed to update profile" }
    }
  }

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return { success: false, error: "Not logged in" }
      }
      if (currentUser.emailVerified) {
        // Update local user state since email is now verified
        if (user) {
          setUser({ ...user, emailVerified: true })
        }
        return { success: false, error: "Email is already verified" }
      }
      await sendEmailVerification(currentUser)
      return { success: true }
    } catch (error: any) {
      console.error("Resend verification error:", error)
      let errorMessage = "Failed to send verification email"
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please wait a few minutes and try again"
      }
      return { success: false, error: errorMessage }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        resetPassword,
        updateProfile,
        resendVerificationEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
