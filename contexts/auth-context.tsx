"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export interface User {
  uid: string
  email: string
  name: string
  role?: string
  shopName?: string
  phone?: string
  createdAt: Date
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
        } else {
          // If no user document exists, create a basic one
          const basicUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "User",
            createdAt: new Date(),
          }
          try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "User",
              createdAt: new Date(),
            })
          } catch (error) {
            console.error("Error creating user document:", error)
          }
          setUser(basicUser)
        }
      } else {
        setFirebaseUser(null)
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Redirect logic: simple auth check (Login -> Dashboard)
    if (!isLoading) {
      const publicPaths = ["/", "/login", "/register", "/forgot-password", "/terms", "/privacy"]
      const isPublicPath = publicPaths.includes(pathname)

      if (!user && !isPublicPath) {
        router.push("/login")
      } else if (user && isPublicPath && pathname !== "/dashboard") {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const getUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          uid: userDoc.id,
          email: data.email,
          name: data.name,
          role: data.role || "user",
          shopName: data.shopName,
          phone: data.phone,
          createdAt: data.createdAt?.toDate() || new Date(),
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

      const newUser: User = {
        uid: userCredential.user.uid,
        email: data.email,
        name: data.name,
        shopName: data.shopName,
        phone: data.phone,
        createdAt: new Date(),
      }

      // Build Firestore document
      const userDoc: Record<string, any> = {
        uid: userCredential.user.uid,
        email: data.email,
        name: data.name,
        createdAt: new Date(),
      }
      
      if (data.shopName) {
        userDoc.shopName = data.shopName
      }
      if (data.phone) {
        userDoc.phone = data.phone
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), userDoc)

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
