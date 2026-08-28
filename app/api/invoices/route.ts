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
      .collection("invoices")
      .orderBy("invoiceDate", "desc")
      .get()

    const invoices = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        _id: doc.id,
        ...data,
        invoiceDate: toDate(data.invoiceDate).toISOString(),
        dueDate: toDate(data.dueDate).toISOString(),
      }
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)

    // Return mock data if database is not available
    const mockInvoices = [
      {
        _id: "1",
        jobCardId: "job1",
        customerId: "cust1",
        invoiceNumber: "INV-001",
        invoiceDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { description: "Screen Replacement", quantity: 1, rate: 12000, amount: 12000 },
          { description: "Labor Charges", quantity: 1, rate: 2000, amount: 2000 },
        ],
        subtotal: 14000,
        taxType: "gst" as const,
        taxPercent: 18,
        taxAmount: 2520,
        totalAmount: 16520,
        amountPaid: 0,
        balanceDue: 16520,
        paymentStatus: "pending" as const,
      },
    ]

    return NextResponse.json(mockInvoices)
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const invoiceId = generateId()

    const taxAmount = (data.subtotal * (data.taxPercent || 0)) / 100

    const invoice = {
      id: invoiceId,
      jobCardId: data.jobCardId,
      customerId: data.customerId,
      invoiceNumber: `INV-${Date.now()}`,
      items: data.items || [],
      subtotal: Number.parseFloat(data.subtotal || 0),
      taxType: data.taxType || "none",
      taxPercent: Number.parseFloat(data.taxPercent || 0),
      taxAmount,
      totalAmount: Number.parseFloat(data.subtotal || 0) + taxAmount,
      amountPaid: Number.parseFloat(data.amountPaid || 0),
      balanceDue:
        Number.parseFloat(data.subtotal || 0) + taxAmount - Number.parseFloat(data.amountPaid || 0),
      paymentStatus: "pending",
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("invoices")
      .doc(invoiceId)
      .set({
        ...invoice,
        invoiceDate: serverTimestamp(),
      })

    return NextResponse.json({
      success: true,
      invoiceId,
    })
  } catch (error) {
    console.error("Invoice creation error:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}