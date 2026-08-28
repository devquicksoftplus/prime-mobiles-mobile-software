import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

// GET - Fetch recent login activities
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")

    // Fetch recent login activities
    const activitiesSnapshot = await adminDb
      .collection("loginActivities")
      .orderBy("timestamp", "desc")
      .limit(limit)
      .get()

    const activities = activitiesSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
        action: data.action || "login",
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      }
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    // Return empty array if collection doesn't exist
    return NextResponse.json({ activities: [] })
  }
}

// POST - Log a new activity (called from auth context)
export async function POST(request: Request) {
  try {
    const { userId, userName, userEmail, action, ipAddress, userAgent } = await request.json()

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log the activity
    await adminDb.collection("loginActivities").add({
      userId,
      userName: userName || "Unknown",
      userEmail,
      action: action || "login",
      timestamp: new Date(),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    })

    // Update user's last login
    await adminDb.collection("users").doc(userId).update({
      lastLogin: new Date(),
      loginCount: require("firebase-admin/firestore").FieldValue.increment(1),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging activity:", error)
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 })
  }
}
