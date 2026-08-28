import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// GET /api/invoice/[id] - Redirects to the actual PDF URL
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 })
    }

    // Look up the invoice link in Firestore
    const linkDoc = await getDoc(doc(db, "invoiceLinks", id))
    
    if (!linkDoc.exists()) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    const data = linkDoc.data()
    const pdfUrl = data.pdfUrl

    if (!pdfUrl) {
      return NextResponse.json({ error: "PDF URL not found" }, { status: 404 })
    }

    // Redirect to the actual PDF
    return NextResponse.redirect(pdfUrl)
    
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
