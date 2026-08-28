"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Settings,
  Shield,
  Bell,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AdminLayout } from "@/features/admin/components/admin-layout"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    notifyNewUsers: true,
    notifyLoginActivity: false,
    notifySubscriptionChanges: true,
    requireEmailVerification: false,
    autoLogoutHours: 24,
    maxLoginAttempts: 5,
  })
  const [adminCredentials, setAdminCredentials] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("adminSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSaveSettings = () => {
    setIsLoading(true)
    // Save settings to localStorage (in production, save to backend)
    localStorage.setItem("adminSettings", JSON.stringify(settings))
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Settings saved successfully")
    }, 500)
  }

  const handleChangePassword = () => {
    if (!adminCredentials.currentPassword) {
      toast.error("Please enter current password")
      return
    }
    if (adminCredentials.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }
    if (adminCredentials.newPassword !== adminCredentials.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // In production, this would call an API to change the password
    toast.success("Password changed successfully")
    setAdminCredentials({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <AdminLayout
      title="Settings"
      description="Configure admin portal settings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Notifications
            </CardTitle>
            <CardDescription className="text-slate-500">
              Configure email notifications for admin events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-900">New User Registrations</Label>
                <p className="text-sm text-slate-500">Get notified when a new user signs up</p>
              </div>
              <Switch
                checked={settings.notifyNewUsers}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyNewUsers: checked })
                }
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-900">Login Activity</Label>
                <p className="text-sm text-slate-500">Get notified on unusual login activity</p>
              </div>
              <Switch
                checked={settings.notifyLoginActivity}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyLoginActivity: checked })
                }
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-900">Subscription Changes</Label>
                <p className="text-sm text-slate-500">
                  Get notified on subscription upgrades/downgrades
                </p>
              </div>
              <Switch
                checked={settings.notifySubscriptionChanges}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifySubscriptionChanges: checked })
                }
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Security
            </CardTitle>
            <CardDescription className="text-slate-500">
              Configure security and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-900">Require Email Verification</Label>
                <p className="text-sm text-slate-500">
                  Users must verify email before accessing
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireEmailVerification: checked })
                }
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-900">Auto Logout (hours)</Label>
              <Input
                type="number"
                min={1}
                max={168}
                value={settings.autoLogoutHours}
                onChange={(e) =>
                  setSettings({ ...settings, autoLogoutHours: parseInt(e.target.value) || 24 })
                }
                className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
              />
              <p className="text-xs text-slate-500">
                Automatically log out inactive admin sessions
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-900">Max Login Attempts</Label>
              <Input
                type="number"
                min={3}
                max={10}
                value={settings.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5 })
                }
                className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
              />
              <p className="text-xs text-slate-500">
                Lock account after this many failed attempts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              Change Admin Password
            </CardTitle>
            <CardDescription className="text-slate-500">
              Update your admin portal password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-600">Current Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={adminCredentials.currentPassword}
                  onChange={(e) =>
                    setAdminCredentials({
                      ...adminCredentials,
                      currentPassword: e.target.value,
                    })
                  }
                  className="bg-white border-slate-200 text-slate-900 pr-10 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">New Password</Label>
              <Input
                type="password"
                value={adminCredentials.newPassword}
                onChange={(e) =>
                  setAdminCredentials({
                    ...adminCredentials,
                    newPassword: e.target.value,
                  })
                }
                className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Confirm New Password</Label>
              <Input
                type="password"
                value={adminCredentials.confirmPassword}
                onChange={(e) =>
                  setAdminCredentials({
                    ...adminCredentials,
                    confirmPassword: e.target.value,
                  })
                }
                className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Admin Info */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Admin Access
            </CardTitle>
            <CardDescription className="text-slate-500">
              How admin access works in Konnect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm text-slate-600">
                Admin access is managed through <strong className="text-slate-900">user roles</strong> in Firestore. 
                The default super admin email (<code className="text-indigo-600">quicksoftplus@gmail.com</code>) 
                automatically gets admin access when registering.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-sm text-emerald-700">
                <strong>To add more admins:</strong> Go to User Management and use the 
                "Promote to Admin" action on any user.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
              <p className="text-sm text-indigo-700">
                <strong>Tip:</strong> You can also add additional super admin emails via the 
                <code className="mx-1">NEXT_PUBLIC_SUPER_ADMIN_EMAILS</code> environment variable (comma-separated).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </AdminLayout>
  )
}
