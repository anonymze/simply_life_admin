import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
	host: process.env.NODE_ENV === "production" ? process.env.SMTP_HOST : "127.0.0.1",
	port: process.env.NODE_ENV === "production" ? Number(process.env.SMTP_PORT) : 1025,
	secure: false, // true for port 465, false for 587
	requireTLS: process.env.NODE_ENV === "production" ? true : false,
	tls: process.env.NODE_ENV === "production" ? {
		rejectUnauthorized: false
	} : undefined,
	auth: {
		user: process.env.NODE_ENV === "production" ? process.env.SMTP_USER : "user",
		pass: process.env.NODE_ENV === "production" ? process.env.SMTP_PASS : "pass",
	},
});

export async function sendEmail(mailOptions: Mail.Options) {
	try {
		console.log("Sending email with config:", {
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			user: process.env.SMTP_USER,
			to: mailOptions.to,
		});
		
		const result = await transporter.sendMail({
			from: `"Simply Life" <${process.env.SMTP_USER}>`,
			...mailOptions,
		});
		
		console.log("Email sent successfully:", result.messageId);
		return result;
	} catch (error) {
		console.error("Email sending failed:", error);
		throw error;
	}
}
