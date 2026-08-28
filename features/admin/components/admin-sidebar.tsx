"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Activity,
  CreditCard,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Login Activity",
    href: "/admin/activity",
    icon: Activity,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white text-slate-900 shadow-lg border border-slate-200"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 transition-all duration-300 shadow-xl",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center flex-shrink-0",
              isCollapsed ? "w-10 h-10" : "h-14"
            )}>
               {isCollapsed ? (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
               ) : (
                  <img src="/konnect-logo.png" alt="Konnect" className="h-full w-auto object-contain" />
               )}
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Admin</h1>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          >
            <ChevronLeft
              className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")}
            />
          </Button>
        </div>

        {/* Back to User Dashboard */}
        <div className="p-4 border-b border-slate-200">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all text-sm font-medium",
              isCollapsed && "justify-center px-0"
            )}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>User Dashboard</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden",
                  isActive
                    ? "text-indigo-700 bg-indigo-50 font-semibold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                )}
                <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-indigo-600" : "group-hover:text-slate-700")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full text-slate-500 hover:text-red-600 hover:bg-red-50",
              isCollapsed ? "justify-center px-0" : "justify-start"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}

