import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from config.env
dotenv.config({ path: path.resolve('data', 'config.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

export default transporter;