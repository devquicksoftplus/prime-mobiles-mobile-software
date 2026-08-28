import { NextRequest, NextResponse } from "next/server"
import { adminStorage, adminAuth } from "@/lib/firebase-admin"
import { v4 as uuidv4 } from "uuid"

interface FirebaseUploadResult {
  url: string
  path: string
  name: string
  size: number
  contentType: string
}

/**
 * Verify Firebase ID token from Authorization header
 * Returns user info if valid, null if invalid
 */
async function verifyAuth(request: NextRequest): Promise<{ uid: string; email?: string; role?: string } | null> {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return null
    }

    const idToken = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role // Custom claim if set
    }
  } catch (error) {
    console.error("[Upload API] Auth verification failed:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // 🔐 Verify user is authenticated
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to upload images." },
        { status: 401 }
      )
    }

    console.log(`[Upload API] Authenticated user: ${user.email || user.uid}`)

    // Check if Firebase Storage is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
      return NextResponse.json(
        { error: "Firebase Storage is not configured. Please add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to your environment variables." },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = formData.get("folder") as string || "device-conditions"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "jpg"
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = `mobilebilling/${folder}/${uniqueFileName}`

    // Get bucket reference
    const bucket = adminStorage.bucket()
    const fileRef = bucket.file(filePath)

    // Upload to Firebase Storage
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
    })

    // Make the file publicly accessible
    await fileRef.makePublic()

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

    const result: FirebaseUploadResult = {
      url: publicUrl,
      path: filePath,
      name: uniqueFileName,
      size: file.size,
      contentType: file.type,
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.path, // Using path as publicId for backward compatibility
      path: result.path,
      name: result.name,
      size: result.size,
      contentType: result.contentType,
    })
  } catch (error) {
    console.error("[Upload API] Error:", error)
    
    // Return detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorDetails = error instanceof Error ? error.stack : JSON.stringify(error)
    
    console.error("[Upload API] Error details:", errorDetails)
    
    return NextResponse.json(
      { 
        error: `Failed to upload image: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    )
  }
}

// Delete image from Firebase Storage
export async function DELETE(request: NextRequest) {
  try {
    // 🔐 Verify user is authenticated
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to delete images." },
        { status: 401 }
      )
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "No publicId provided" }, { status: 400 })
    }

    console.log(`[Upload API] User ${user.email || user.uid} deleting: ${publicId}`)

    // Get bucket reference
    const bucket = adminStorage.bucket()
    const fileRef = bucket.file(publicId)

    // Delete the file
    await fileRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Upload API] Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}
