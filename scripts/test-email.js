import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  requireTLS: true,
  tls: {
    rejectUnauthorized: true,
  },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  try {
    console.log('Testing email send...');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
    });
    
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'anodevfr@gmail.com',
      subject: 'Test Email from Simply Life Admin',
      text: 'This is a test email sent from the Simply Life Admin system.',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email sent from the Simply Life Admin system.</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    process.exit(0);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    process.exit(1);
  }
}

testEmail();