import { adminDb, toDate } from "@/lib/firestore"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id")
    const { id } = await params

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doc = await adminDb
      .collection("users")
      .doc(userId)
      .collection("repairs")
      .doc(id)
      .get()

    if (!doc.exists) {
      return Response.json({ error: "Repair not found" }, { status: 404 })
    }

    const data = doc.data()
    return Response.json({
      _id: doc.id,
      ...data,
      createdAt: toDate(data?.createdAt),
    })
  } catch (error) {
    return Response.json({ error: "Failed to fetch repair" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id")
    const { id } = await params
    const data = await request.json()

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const docRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("repairs")
      .doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      return Response.json({ error: "Repair not found" }, { status: 404 })
    }

    await docRef.update({
      ...data,
      updatedAt: new Date(),
    })

    return Response.json({ message: "Updated successfully" })
  } catch (error) {
    return Response.json({ error: "Failed to update repair" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id")
    const { id } = await params

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const docRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("repairs")
      .doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      return Response.json({ error: "Repair not found" }, { status: 404 })
    }

    await docRef.delete()

    return Response.json({ message: "Deleted successfully" })
  } catch (error) {
    return Response.json({ error: "Failed to delete repair" }, { status: 500 })
  }
}
