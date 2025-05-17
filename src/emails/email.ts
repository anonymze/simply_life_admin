import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: process.env.NODE_ENV === "production" ? process.env.SMTP_HOST : "127.0.0.1",
  port: process.env.NODE_ENV === "production" ? Number(process.env.SMTP_PORT) : 1025,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.NODE_ENV === "production" ? process.env.SMTP_USER : "user",
    pass: process.env.NODE_ENV === "production" ? process.env.SMTP_PASS : "pass",
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  await transporter.sendMail({
    from: `"Simply Life" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}