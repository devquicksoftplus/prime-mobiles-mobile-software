import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  try {
    // Simple admin token verification (in production, use proper JWT verification)
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("[Admin Users API] No authorization header provided")
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (!token || token === "null" || token === "undefined") {
      console.error("[Admin Users API] Invalid token:", token)
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 })
    }

    console.log("[Admin Users API] Fetching users from Firestore...")

    // Fetch all users from Firestore using Admin SDK (bypasses security rules)
    const usersSnapshot = await adminDb.collection("users").get()

    console.log(`[Admin Users API] Found ${usersSnapshot.docs.length} users`)

    const users = usersSnapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        uid: docSnap.id,
        email: data.email || "",
        name: data.name || "",
        role: data.role || "user",
        shopName: data.shopName || "",
        phone: data.phone || "",
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        subscription: data.subscription || null,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("[Admin Users API] Error fetching users:", error)
    
    // Check if it's a Firebase Admin initialization error
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    if (errorMessage.includes("FIREBASE_SERVICE_ACCOUNT_KEY") || errorMessage.includes("credential")) {
      return NextResponse.json({ 
        error: "Firebase Admin not configured. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable.",
        details: errorMessage
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: "Failed to fetch users", 
      details: errorMessage 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Simple admin token verification
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { uid, role } = await request.json()

    if (!uid || !role) {
      return NextResponse.json({ error: "Missing uid or role" }, { status: 400 })
    }

    // Update user role using Admin SDK
    await adminDb.collection("users").doc(uid).update({ role })

    return NextResponse.json({ success: true, message: "User role updated" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Simple admin token verification
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 })
    }

    // Delete user document from Firestore using Admin SDK
    await adminDb.collection("users").doc(uid).delete()

    // Note: This doesn't delete the user from Firebase Auth
    // You would need Firebase Admin SDK's adminAuth.deleteUser(uid) for that

    return NextResponse.json({ success: true, message: "User deleted" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
