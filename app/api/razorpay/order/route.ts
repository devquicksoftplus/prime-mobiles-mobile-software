import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(req: Request) {
  console.log("POST /api/razorpay/order hit")

  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    console.error("Razorpay keys missing in environment")
    return NextResponse.json({ error: "Razorpay configuration error" }, { status: 500 })
  }

  const razorpay = new Razorpay({
    key_id,
    key_secret,
  })

  try {
    const { amount, planId } = await req.json()
    console.log("Request data:", { amount, planId })

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId,
      },
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Razorpay order error:", error)
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 })
  }
}
