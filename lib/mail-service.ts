import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: (process.env.SMTP_USER || "qsoftplus@gmail.com").trim(),
    pass: (process.env.SMTP_PASSWORD || "").replace(/\s/g, ""), // Use an App Password here
  },
});


