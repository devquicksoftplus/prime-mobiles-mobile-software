import { adminDb, generateId, serverTimestamp, toDate } from "@/lib/firestore"
import type { RepairTicket } from "@/lib/schemas"

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const snapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("repairs")
      .orderBy("createdAt", "desc")
      .get()

    const repairs = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt),
    }))

    return Response.json(repairs)
  } catch (error) {
    return Response.json({ error: "Failed to fetch repairs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const repairId = generateId()

    const ticket: RepairTicket & { id: string } = {
      id: repairId,
      ...data,
      status: "pending",
      createdAt: new Date(),
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("repairs")
      .doc(repairId)
      .set({
        ...ticket,
        createdAt: serverTimestamp(),
      })

    return Response.json({ _id: repairId, ...ticket }, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create repair ticket" }, { status: 500 })
  }
}
