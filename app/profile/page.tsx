"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Mail, Phone, Store, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "",
    shopName: "",
    phone: "",
  })

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        shopName: user.shopName || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    const result = await updateProfile({
      name: profileForm.name,
      shopName: profileForm.shopName,
      phone: profileForm.phone,
    })
    setIsUpdating(false)

    if (result.success) {
      toast.success("Profile updated successfully!")
    } else {
      toast.error(result.error || "Failed to update profile")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container max-w-4xl py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {getInitials(profileForm.name || user.email || "U")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{profileForm.name || "User"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{user.role}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="profile-name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="profile-email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-shop" className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    Shop/Business Name
                  </Label>
                  <Input
                    id="profile-shop"
                    value={profileForm.shopName}
                    onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                    placeholder="Enter your shop name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="profile-phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
