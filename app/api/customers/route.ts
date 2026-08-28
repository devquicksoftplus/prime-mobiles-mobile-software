import { adminDb, generateId, serverTimestamp, toDate } from "@/lib/firestore"
import type { Customer } from "@/lib/db-schemas"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customerId = generateId()
    const customer: Customer & { id: string } = {
      id: customerId,
      name: data.name,
      phone: data.phone,
      alternatePhone: data.alternatePhone || "",
      address: data.address || "",
      email: data.email || null,
      createdAt: new Date(),
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("customers")
      .doc(customerId)
      .set({
        ...customer,
        createdAt: serverTimestamp(),
      })

    return Response.json({ success: true, customerId })
  } catch (error) {
    console.error("[Firebase] Customer creation error:", error)
    return Response.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const snapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("customers")
      .orderBy("createdAt", "desc")
      .get()

    const customers = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt),
    }))

    return Response.json(customers)
  } catch (error) {
    console.error("[Firebase] Fetch customers error:", error)
    return Response.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
