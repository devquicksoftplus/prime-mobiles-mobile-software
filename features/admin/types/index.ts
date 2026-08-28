// Admin Types

export interface AdminUser {
  uid: string
  email: string
  name: string
  role: "user" | "admin"
  shopName?: string
  phone?: string
  createdAt: string
  subscription?: SubscriptionInfo
  lastLogin?: string
  loginCount?: number
}

export interface SubscriptionInfo {
  plan: "free" | "basic" | "premium" | "enterprise"
  status: "active" | "expired" | "cancelled" | "trial"
  startDate: string
  endDate: string
  autoRenew: boolean
}

export interface LoginActivity {
  id: string
  userId: string
  userName: string
  userEmail: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
  action: "login" | "logout"
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  newUsersThisYear: number
  loginsThisMonth: number
  loginsThisYear: number
  activeSubscriptions: number
  expiredSubscriptions: number
  revenueThisMonth: number
  revenueThisYear: number
}

export interface ChartData {
  name: string
  value: number
}

export interface MonthlyStats {
  month: string
  logins: number
  newUsers: number
  revenue: number
}
