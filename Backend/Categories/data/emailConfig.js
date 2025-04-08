  // emailConfig.js - Brevo API Email Sending
  import axios from "axios";
  import dotenv from "dotenv";
  import path from "path";
  import { fileURLToPath } from "url";
  
  // ⭐ Ye 2 line __dirname banane ke liye ES Modules me
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // ⭐ Yaha se config.env load karo
  dotenv.config({
    path: path.resolve(__dirname, "../config.env"), // "../" = data se bahar jao Categories me
  });
  
  const sendEmail = async (to, subject, htmlContent, textContent) => {
    try {
      const response = await axios.post("https://api.brevo.com/v3/smtp/email", {
        sender: { email: process.env.SMTP_USER },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent
      }, {
        headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json" }
      });

      console.log("Email sent successfully to:", to);
      return { success: true, response: response.data };
    } catch (error) {
      console.error("Email sending failed:", error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  export default sendEmail;