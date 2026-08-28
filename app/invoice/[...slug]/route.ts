import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// GET /invoice/[shopName]/[customerName]/[id] - Redirects to the actual PDF URL
// The URL format is: /invoice/{shop-name}/{customer-name}/{invoice-id}
// Only the invoice-id is used for lookup, others are for display/SEO
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    
    if (!slug || slug.length === 0) {
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 })
    }

    // The invoice ID is the LAST segment in the URL
    // e.g., /invoice/qsoft-mobiles/sathya/ABC123 -> ID = ABC123
    const invoiceId = slug[slug.length - 1]
    
    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 })
    }

    // Look up the invoice link in Firestore
    const linkDoc = await getDoc(doc(db, "invoiceLinks", invoiceId))
    
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
