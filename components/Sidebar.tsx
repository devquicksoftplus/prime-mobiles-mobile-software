"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Wrench,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Settings,
  Building2,
  UserCircle,
  Palette,
  Wallet,
  Crown,
  Shield
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useSidebar } from "@/contexts/sidebar-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Service Details", href: "/job-cards", icon: Wrench },
  { name: "Products", href: "/inventory", icon: Package },
  { name: "Expenses", href: "/expenses", icon: Wallet },
  { name: "Templates", href: "/templates", icon: Palette },
]

const settingsNavigation = [
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Company Details", href: "/company-settings", icon: Building2 },
]


export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, updateProfile } = useAuth()
  const { isOpen, isCollapsed, toggle, toggleCollapse } = useSidebar()
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "",
    shopName: "",
    phone: "",
  })

  // Open profile dialog and populate form
  const handleOpenProfile = () => {
    setProfileForm({
      name: user?.name || "",
      shopName: user?.shopName || "",
      phone: user?.phone || "",
    })
    setProfileDialogOpen(true)
  }

  // Save profile changes
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
      setProfileDialogOpen(false)
    } else {
      toast.error(result.error || "Failed to update profile")
    }
  }

  // Get display name with fallback to email
  const getDisplayName = () => {
    if (user?.name && user.name !== "User") {
      return user.name
    }
    // Fallback to email username (before @)
    if (user?.email) {
      return user.email.split("@")[0]
    }
    return "User"
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = getDisplayName()

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggle}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <aside 
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0 flex flex-col shadow-sm transition-all duration-300 ease-in-out z-50",
          // Desktop: collapse to icon-only or full width
          isCollapsed ? "w-[72px]" : "w-64",
          // Mobile: slide in/out
          "fixed lg:sticky",
          isOpen ? "left-0" : "-left-64 lg:left-0"
        )}
      >
        {/* Logo & Collapse Toggle */}
        <div className="p-4 pb-6 flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            isCollapsed && "justify-center w-full"
          )}>
            <div className={cn(
               "flex items-center justify-center flex-shrink-0", 
               isCollapsed ? "w-9 h-9" : "h-20"
             )}>
               {isCollapsed ? (
                 <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                   K
                 </div>
               ) : (
                 <img 
                   src="/konnect-logo.png" 
                   alt="Konnect" 
                   className="h-full w-auto object-contain"
                 />
               )}
             </div>
          </div>
          
          {/* Desktop Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 hidden lg:flex text-muted-foreground hover:text-foreground transition-all",
              isCollapsed && "absolute -right-3 top-6 bg-sidebar border border-border rounded-full shadow-sm"
            )}
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close mobile menu on navigation
                  if (window.innerWidth < 1024) toggle()
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm whitespace-nowrap overflow-hidden">{item.name}</span>
                )}
              </Link>
            )

            // Wrap in tooltip when collapsed
            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return linkContent
          })}

          {/* Settings Divider */}
          <div className={cn(
            "pt-4 mt-4 border-t border-sidebar-border",
            isCollapsed && "pt-2 mt-2"
          )}>
            {!isCollapsed && (
              <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Settings
              </span>
            )}
          </div>

          {/* Settings Navigation */}
          {settingsNavigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close mobile menu on navigation
                  if (window.innerWidth < 1024) toggle()
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm whitespace-nowrap overflow-hidden">{item.name}</span>
                )}
              </Link>
            )

            // Wrap in tooltip when collapsed
            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            }

          })}
        </nav>

        {/* User Profile */}
        <div className={cn(
          "p-3 border-t border-sidebar-border",
          isCollapsed && "flex justify-center"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center p-2 rounded-xl hover:bg-sidebar-accent transition-colors">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {displayName}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-sidebar-accent transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.role || "Guest"}</p>
                  </div>
                </button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCollapsed ? "center" : "end"} side={isCollapsed ? "right" : "top"} className="w-56 rounded-xl">
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleOpenProfile}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={logout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Profile Edit Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-shop">Shop Name</Label>
              <Input
                id="profile-shop"
                value={profileForm.shopName}
                onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                placeholder="Enter your shop name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input
                id="profile-phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
