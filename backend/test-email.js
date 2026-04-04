require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testEmail() {
  console.log('Testing email transport for:', process.env.SMTP_USER);
  try {
    const mailOptions = {
        from: `"EyeCare AI" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // send to self
        subject: 'Email Test',
        text: 'This is a test email.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Email failed:', err);
  }
}

testEmail();
