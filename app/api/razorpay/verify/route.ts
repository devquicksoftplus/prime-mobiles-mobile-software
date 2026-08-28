import { NextResponse } from "next/server"
import crypto from "crypto"
import { sendSubscriptionEmail } from "@/lib/mail-service"

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            email,
            userName,
            planName,
        } = await req.json()

        const secret = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!

        const body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex")

        const isAuthentic = expectedSignature === razorpay_signature

        if (isAuthentic) {
            // Send professional confirmation email (non-blocking)
            if (email && userName && planName) {
                console.log(`Triggering confirmation email for ${email}...`);
                sendSubscriptionEmail(email, userName, planName).catch(err =>
                    console.error("Delayed email error:", err)
                );
            }
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
        }
    } catch (error) {
        console.error("Razorpay verification error:", error)
        return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
    }
}
