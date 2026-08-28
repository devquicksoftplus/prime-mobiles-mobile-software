import { adminDb, generateId, serverTimestamp, toDate } from "@/lib/firestore"
import type { Device } from "@/lib/db-schemas"

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const deviceId = generateId()

    const device: Device & { id: string } = {
      id: deviceId,
      customerId: data.customerId,
      deviceType: data.deviceType,
      brand: data.brand,
      model: data.model,
      imei: data.imei || "",
      condition: data.condition || "",
      accessories: data.accessories || "",
      conditionImages: data.conditionImages || [],
      createdAt: new Date(),
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("devices")
      .doc(deviceId)
      .set({
        ...device,
        createdAt: serverTimestamp(),
      })

    return Response.json({ success: true, deviceId })
  } catch (error) {
    console.error("[Firebase] Device creation error:", error)
    return Response.json({ error: "Failed to create device" }, { status: 500 })
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
      .collection("devices")
      .orderBy("createdAt", "desc")
      .get()

    const devices = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt),
    }))

    return Response.json(devices)
  } catch (error) {
    console.error("[Firebase] Fetch devices error:", error)
    return Response.json({ error: "Failed to fetch devices" }, { status: 500 })
  }
}
