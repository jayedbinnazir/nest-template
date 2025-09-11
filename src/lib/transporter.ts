import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Dynamically load the correct .env file based on NODE_ENV, default to .env.dev
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.dev';
dotenv.config({ path: envFile });

console.log("SMTP CONFIG", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
});

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify()
  .then(() => console.log('Gmail transporter ready'))
  .catch(err => console.error('Transporter error:', err));
