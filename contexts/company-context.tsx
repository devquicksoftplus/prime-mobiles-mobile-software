"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-context"
import { Company, CompanyFormData } from "@/lib/validations/company.schema"

interface CompanyContextType {
  company: Company | null
  isLoading: boolean
  error: string | null
  updateCompany: (data: CompanyFormData) => Promise<{ success: boolean; error?: string }>
  refreshCompany: () => Promise<void>
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch company details when user changes
  useEffect(() => {
    if (user?.uid) {
      fetchCompanyDetails()
    } else {
      setCompany(null)
      setIsLoading(false)
    }
  }, [user?.uid])

  const fetchCompanyDetails = async () => {
    if (!user?.uid) return

    setIsLoading(true)
    setError(null)

    try {
      const companyDoc = await getDoc(doc(db, "companies", user.uid))
      
      if (companyDoc.exists()) {
        const data = companyDoc.data()
        setCompany({
          id: companyDoc.id,
          userId: user.uid,
          companyName: data.companyName || "",
          tagline: data.tagline,
          phone: data.phone || "",
          alternatePhone: data.alternatePhone,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          gstNumber: data.gstNumber,
          logoUrl: data.logoUrl,
          logoPublicId: data.logoPublicId,
          website: data.website,
          selectedTerms: data.selectedTerms || [],
          customTerms: data.customTerms || [],
          termsAndConditions: data.termsAndConditions,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        })
      } else {
        // Create default company record with shop name from user
        const defaultCompany: Partial<Company> = {
          userId: user.uid,
          companyName: user.shopName || "",
          phone: user.phone || "",
          email: user.email || "",
        }
        setCompany(defaultCompany as Company)
      }
    } catch (err) {
      console.error("Error fetching company details:", err)
      setError("Failed to load company details")
    } finally {
      setIsLoading(false)
    }
  }

  const updateCompany = async (data: CompanyFormData): Promise<{ success: boolean; error?: string }> => {
    if (!user?.uid) {
      return { success: false, error: "Not authenticated" }
    }

    try {
      const companyRef = doc(db, "companies", user.uid)
      const companyDoc = await getDoc(companyRef)

      const companyData = {
        ...data,
        userId: user.uid,
        updatedAt: serverTimestamp(),
      }

      if (companyDoc.exists()) {
        await updateDoc(companyRef, companyData)
      } else {
        await setDoc(companyRef, {
          ...companyData,
          createdAt: serverTimestamp(),
        })
      }

      // Refresh company data
      await fetchCompanyDetails()
      
      return { success: true }
    } catch (err) {
      console.error("Error updating company:", err)
      return { success: false, error: "Failed to update company details" }
    }
  }

  const refreshCompany = async () => {
    await fetchCompanyDetails()
  }

  return (
    <CompanyContext.Provider
      value={{
        company,
        isLoading,
        error,
        updateCompany,
        refreshCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider")
  }
  return context
}
