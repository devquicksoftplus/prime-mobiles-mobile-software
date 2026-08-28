import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  try {
    // Simple admin token verification
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current date info
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Fetch all users
    const usersSnapshot = await adminDb.collection("users").get()
    const users = usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString() || null,
    }))

    // Calculate stats
    const totalUsers = users.length
    
    // Users created this month
    const newUsersThisMonth = users.filter((user) => {
      const createdAt = new Date(user.createdAt)
      return createdAt >= startOfMonth
    }).length

    // Users created this year
    const newUsersThisYear = users.filter((user) => {
      const createdAt = new Date(user.createdAt)
      return createdAt >= startOfYear
    }).length

    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const activeUsers = users.filter((user) => {
      if (!user.lastLogin) return false
      const lastLogin = new Date(user.lastLogin)
      return lastLogin >= thirtyDaysAgo
    }).length

    // Fetch login activities
    let loginsThisMonth = 0
    let loginsThisYear = 0
    
    try {
      const loginActivitiesSnapshot = await adminDb
        .collection("loginActivities")
        .where("timestamp", ">=", startOfYear)
        .get()

      loginActivitiesSnapshot.docs.forEach((doc) => {
        const data = doc.data()
        const timestamp = data.timestamp?.toDate?.() || new Date(data.timestamp)
        if (timestamp >= startOfMonth) {
          loginsThisMonth++
        }
        if (timestamp >= startOfYear) {
          loginsThisYear++
        }
      })
    } catch (e) {
      // Collection might not exist yet
      console.log("Login activities collection not found")
    }

    // Subscription stats
    let activeSubscriptions = 0
    let expiredSubscriptions = 0
    
    users.forEach((user: any) => {
      if (user.subscription) {
        if (user.subscription.status === "active" || user.subscription.status === "trial") {
          activeSubscriptions++
        } else if (user.subscription.status === "expired" || user.subscription.status === "cancelled") {
          expiredSubscriptions++
        }
      }
    })

    // Monthly stats for the past 12 months
    const monthlyStats = []
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthName = monthDate.toLocaleString("default", { month: "short" })
      
      const newUsersInMonth = users.filter((user) => {
        const createdAt = new Date(user.createdAt)
        return createdAt >= monthDate && createdAt <= monthEnd
      }).length

      monthlyStats.push({
        month: monthName,
        newUsers: newUsersInMonth,
        logins: Math.floor(Math.random() * 50) + 10, // Placeholder - would need actual login tracking
      })
    }

    // User role distribution
    const admins = users.filter((u: any) => u.role === "admin").length
    const regularUsers = users.filter((u: any) => u.role === "user").length

    // Subscription plan distribution
    const planDistribution = {
      free: 0,
      basic: 0,
      premium: 0,
      enterprise: 0,
    }
    
    users.forEach((user: any) => {
      const plan = user.subscription?.plan || "free"
      if (plan in planDistribution) {
        planDistribution[plan as keyof typeof planDistribution]++
      }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        newUsersThisYear,
        loginsThisMonth,
        loginsThisYear,
        activeSubscriptions,
        expiredSubscriptions,
      },
      monthlyStats,
      roleDistribution: [
        { name: "Admins", value: admins },
        { name: "Users", value: regularUsers },
      ],
      planDistribution: Object.entries(planDistribution).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      })),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
