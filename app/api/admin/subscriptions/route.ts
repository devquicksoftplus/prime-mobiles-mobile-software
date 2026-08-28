import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { uid, subscription } = await request.json()

    if (!uid || !subscription) {
      return NextResponse.json({ error: "Missing uid or subscription data" }, { status: 400 })
    }

    // Update user's subscription
    await adminDb.collection("users").doc(uid).update({
      subscription: {
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        autoRenew: subscription.autoRenew,
      },
    })

    return NextResponse.json({ success: true, message: "Subscription updated" })
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
  }
}

// GET - Fetch subscription stats
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const usersSnapshot = await adminDb.collection("users").get()
    
    const stats = {
      total: 0,
      active: 0,
      trial: 0,
      expired: 0,
      cancelled: 0,
      basic: 0,
      pro: 0,
      elite: 0,
      monthlyRevenue: 0,
    }

    const planPrices = {
      basic: 400,
      pro: 700,
      elite: 999,
    }

    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      stats.total++
      
      const planId = data.subscription?.planId
      const status = data.subscription?.status || "active"

      // Count by status
      if (status === "active") stats.active++
      else if (status === "trial") stats.trial++
      else if (status === "expired") stats.expired++
      else if (status === "cancelled") stats.cancelled++

      // Count by plan
      if (planId === "basic") stats.basic++
      else if (planId === "pro") stats.pro++
      else if (planId === "elite") stats.elite++

      // Calculate revenue (only active subscriptions)
      if (status === "active" && planId) {
        stats.monthlyRevenue += planPrices[planId as keyof typeof planPrices] || 0
      }
    })

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching subscription stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
