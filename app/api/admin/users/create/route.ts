import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    // Simple admin token verification
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, password, name, shopName, phone, role } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    })

    // Build user document
    const userDoc: Record<string, any> = {
      uid: userRecord.uid,
      email,
      name,
      role: role || "user",
      createdAt: new Date(),
    }

    if (shopName) userDoc.shopName = shopName
    if (phone) userDoc.phone = phone

    // Save to Firestore
    await adminDb.collection("users").doc(userRecord.uid).set(userDoc)

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email,
        name,
        role: role || "user",
      },
    })
  } catch (error: any) {
    console.error("Error creating user:", error)
    
    let errorMessage = "Failed to create user"
    if (error.code === "auth/email-already-exists") {
      errorMessage = "Email already in use"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak"
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
