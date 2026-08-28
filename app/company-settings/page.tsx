"use client"

import { useState, useEffect, useRef } from "react"
import { useCompany } from "@/contexts/company-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  FileText, 
  Upload, 
  X, 
  Loader2,
  Image as ImageIcon,
  Info,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { CompanyFormData, PREDEFINED_TERMS } from "@/lib/validations/company.schema"
import Image from "next/image"

export default function CompanySettingsPage() {
  const { company, isLoading: isLoadingCompany, updateCompany } = useCompany()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [newCustomTerm, setNewCustomTerm] = useState("")
  const [showAllTerms, setShowAllTerms] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    tagline: "",
    phone: "",
    alternatePhone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    logoUrl: null,
    logoPublicId: null,
    website: "",
    selectedTerms: [],
    customTerms: [],
    termsAndConditions: "",
  })

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        tagline: company.tagline || "",
        phone: company.phone || "",
        alternatePhone: company.alternatePhone || "",
        email: company.email || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        pincode: company.pincode || "",
        gstNumber: company.gstNumber || "",
        logoUrl: company.logoUrl || null,
        logoPublicId: company.logoPublicId || null,
        website: company.website || "",
        selectedTerms: company.selectedTerms || [],
        customTerms: company.customTerms || [],
        termsAndConditions: company.termsAndConditions || "",
      })
    }
  }, [company])

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB")
      return
    }

    setIsUploadingLogo(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) {
        throw new Error("Failed to upload logo")
      }

      const result = await response.json()
      
      setFormData((prev) => ({
        ...prev,
        logoUrl: result.url,
        logoPublicId: result.publicId,
      }))

      toast.success("Logo uploaded successfully!")
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast.error("Failed to upload logo. Please try again.")
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: null,
      logoPublicId: null,
    }))
  }

  // Handle toggling predefined terms
  const handleToggleTerm = (termId: string) => {
    setFormData((prev) => {
      const currentTerms = prev.selectedTerms || []
      const isSelected = currentTerms.includes(termId)
      
      return {
        ...prev,
        selectedTerms: isSelected 
          ? currentTerms.filter(id => id !== termId)
          : [...currentTerms, termId]
      }
    })
  }

  // Handle adding custom term
  const handleAddCustomTerm = () => {
    if (!newCustomTerm.trim()) {
      toast.error("Please enter a term")
      return
    }

    setFormData((prev) => ({
      ...prev,
      customTerms: [...(prev.customTerms || []), newCustomTerm.trim()]
    }))
    setNewCustomTerm("")
    toast.success("Custom term added!")
  }

  // Handle removing custom term
  const handleRemoveCustomTerm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customTerms: (prev.customTerms || []).filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    if (!formData.companyName.trim()) {
      toast.error("Company name is required")
      return
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required")
      return
    }

    setIsUpdating(true)
    const result = await updateCompany(formData)
    setIsUpdating(false)

    if (result.success) {
      toast.success("Company details saved successfully!")
    } else {
      toast.error(result.error || "Failed to save company details")
    }
  }

  if (isLoadingCompany) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your company details that will appear on invoices and receipts
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-primary">Invoice Branding</p>
          <p className="text-sm text-muted-foreground">
            The information you enter here will be displayed on all invoices and receipts generated for your customers.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Logo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Identity
            </CardTitle>
            <CardDescription>
              Your company logo and basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <Label>Company Logo</Label>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div 
                    className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-xl flex items-center justify-center bg-muted/50 overflow-hidden"
                  >
                    {formData.logoUrl ? (
                      <Image
                        src={formData.logoUrl}
                        alt="Company Logo"
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                    )}
                  </div>
                  {formData.logoUrl && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 200x200px, PNG or JPG, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="e.g., Mobile Service Center"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="tagline">Tagline / Slogan</Label>
                <Input
                  id="tagline"
                  value={formData.tagline || ""}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                  placeholder="e.g., Professional Device Repair Services"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              How customers can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternatePhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Alternate Phone
                </Label>
                <Input
                  id="alternatePhone"
                  value={formData.alternatePhone || ""}
                  onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                  placeholder="+91 98765 43211"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="info@yourcompany.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.yourcompany.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Business Address
            </CardTitle>
            <CardDescription>
              Your shop or office location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123, Main Street, Near Landmark"
                rows={2}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Chennai"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Tamil Nadu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode || ""}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="600001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax & Legal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax & Legal Information
            </CardTitle>
            <CardDescription>
              GST and terms for invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber || ""}
                  onChange={(e) => handleInputChange("gstNumber", e.target.value.toUpperCase())}
                  placeholder="22XXXXX1234X1Z5"
                />
                <p className="text-xs text-muted-foreground">
                  Will be displayed on invoices if provided
                </p>
              </div>
            </div>

            <Separator />

            {/* Terms & Conditions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Terms & Conditions</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select terms to appear on invoices ({(formData.selectedTerms || []).length} selected)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllTerms(!showAllTerms)}
                  className="text-primary hover:text-primary"
                >
                  {showAllTerms ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      View All ({PREDEFINED_TERMS.length})
                    </>
                  )}
                </Button>
              </div>

              {/* Predefined Terms with Checkboxes - Collapsible */}
              <div 
                className={`
                  relative rounded-lg border border-border bg-muted/30 p-3
                  ${showAllTerms ? 'max-h-[400px]' : 'max-h-[200px]'}
                  overflow-y-auto transition-all duration-300
                `}
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  {(showAllTerms ? PREDEFINED_TERMS : PREDEFINED_TERMS.slice(0, 6)).map((term) => (
                    <div 
                      key={term.id} 
                      className="flex items-start space-x-3 p-2.5 rounded-md bg-background border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer"
                      onClick={() => handleToggleTerm(term.id)}
                    >
                      <Checkbox
                        id={term.id}
                        checked={(formData.selectedTerms || []).includes(term.id)}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => handleToggleTerm(term.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={term.id}
                        className="text-sm leading-tight cursor-pointer select-none flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {term.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                {/* Fade gradient when collapsed */}
                {!showAllTerms && PREDEFINED_TERMS.length > 6 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/80 to-transparent pointer-events-none rounded-b-lg" />
                )}
              </div>

              {/* Quick info about hidden terms */}
              {!showAllTerms && PREDEFINED_TERMS.length > 6 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{PREDEFINED_TERMS.length - 6} more terms available
                </p>
              )}

              <Separator />

              {/* Custom Terms Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Add Custom Terms</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your own custom terms and conditions that are specific to your business.
                  </p>
                </div>

                {/* Add Custom Term Input */}
                <div className="flex gap-2">
                  <Input
                    value={newCustomTerm}
                    onChange={(e) => setNewCustomTerm(e.target.value)}
                    placeholder="Enter your custom term..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddCustomTerm()
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddCustomTerm}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Custom Terms List */}
                {(formData.customTerms || []).length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your Custom Terms:</Label>
                    <div className="space-y-2">
                      {(formData.customTerms || []).map((term, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <span className="text-sm">{term}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveCustomTerm(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Info */}
              {((formData.selectedTerms || []).length > 0 || (formData.customTerms || []).length > 0) && (
                <>
                  <Separator />
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-2">Preview - Terms on Invoice:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      {(formData.selectedTerms || []).map((termId) => {
                        const term = PREDEFINED_TERMS.find(t => t.id === termId)
                        return term ? (
                          <li key={termId}>{term.label}</li>
                        ) : null
                      })}
                      {(formData.customTerms || []).map((term, index) => (
                        <li key={`custom-${index}`}>{term}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isUpdating}
            size="lg"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Company Details"
            )}
          </Button>
        </div>
      </div>
      </div>
    </PageLayout>
  )
}
