import { NextResponse } from "next/server"
import { adminDb, generateId, serverTimestamp, toDate } from "@/lib/firestore"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const snapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("inventory")
      .orderBy("createdAt", "desc")
      .get()

    const inventory = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt),
    }))

    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const itemId = generateId()

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("inventory")
      .doc(itemId)
      .set({
        ...body,
        createdAt: serverTimestamp(),
      })

    return NextResponse.json({
      _id: itemId,
      ...body,
    })
  } catch (error) {
    console.error("Error adding inventory item:", error)
    return NextResponse.json(
      { error: "Failed to add inventory item" },
      { status: 500 }
    )
  }
}