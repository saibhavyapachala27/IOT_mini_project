import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_PORT === '465', // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Gmail SMTP credentials (MAIL_USER and MAIL_PASS) are not configured in the backend .env file.");
    }

    const info = await transporter.sendMail({
      from: `"Sansah Innovations" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
