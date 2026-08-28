import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: (process.env.SMTP_USER || "qsoftplus@gmail.com").trim(),
    pass: (process.env.SMTP_PASSWORD || "").replace(/\s/g, ""), // Use an App Password here
  },
});

export async function sendSubscriptionEmail(to: string, userName: string, planName: string) {
  if (!process.env.SMTP_PASSWORD) {
    console.warn("SMTP_PASSWORD not set. Skipping email notification.");
    return;
  }

  const mailOptions = {
    from: `"Asrock Mobile Services" <${process.env.SMTP_USER || "qsoftplus@gmail.com"}>`,
    to: to,
    subject: "Subscription Confirmed - Asrock Mobile Services",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb;">Asrock Mobile Services</h1>
        </div>
        <p>Dear <strong>${userName}</strong>,</p>
        <p>Thank you for subscribing to our <strong>${planName}</strong> plan! Your payment has been successfully processed via Razorpay.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Plan:</strong> ${planName}</p>
          <p style="margin: 0;"><strong>Status:</strong> Active</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>You can now access all the premium features associated with your plan. Log in to your dashboard to get started.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/dashboard" 
             style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
        <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e0e0e0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          &copy; ${new Date().getFullYear()} Asrock Mobile Services. All rights reserved.<br/>
          If you have any questions, contact us at qsoftplus@gmail.com
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Subscription confirmation email sent to ${to}`);
  } catch (error) {
    console.error("Error sending subscription email:", error);
  }
}
