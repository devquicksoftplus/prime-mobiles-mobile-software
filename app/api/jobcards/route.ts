// app/api/jobcards/route.ts
import { adminDb, generateId, serverTimestamp, toDate } from "@/lib/firestore"
import type { JobCard } from "@/lib/db-schemas"

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const jobCardId = generateId()

    const jobCard: Omit<JobCard, "customerId" | "deviceId"> & {
      id: string
      customerId: string
      deviceId: string
    } = {
      id: jobCardId,
      customerId: data.customerId,
      deviceId: data.deviceId,
      problemDescription: data.problemDescription,
      technicianDiagnosis: data.technicianDiagnosis,
      requiredParts: data.requiredParts || [],
      costEstimate: {
        laborCost: Number.parseFloat(data.laborCost || 0),
        partsCost: Number.parseFloat(data.partsCost || 0),
        serviceCost: Number.parseFloat(data.serviceCost || 0),
        total:
          Number.parseFloat(data.laborCost || 0) +
          Number.parseFloat(data.partsCost || 0) +
          Number.parseFloat(data.serviceCost || 0),
      },
      advanceReceived: Number.parseFloat(data.advanceReceived || 0),
      deliveryDate: new Date(data.deliveryDate),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("jobCards")
      .doc(jobCardId)
      .set({
        ...jobCard,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

    return Response.json({ success: true, jobCardId })
  } catch (error) {
    console.error("Job card error:", error)
    return Response.json({ error: "Failed to create job card" }, { status: 500 })
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
      .collection("jobCards")
      .orderBy("createdAt", "desc")
      .get()

    const jobCards = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt),
      updatedAt: toDate(doc.data().updatedAt),
      deliveryDate: toDate(doc.data().deliveryDate),
    }))

    return Response.json(jobCards)
  } catch (error) {
    return Response.json({ error: "Failed to fetch job cards" }, { status: 500 })
  }
}
