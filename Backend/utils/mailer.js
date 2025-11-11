// Backend/utils/mailer.js
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { generateWelcomeEmail } from "./welcomeEmail.js";
import { generateResetPasswordEmail } from "./resetPasswordEmail.js";
import { generateJobMatchEmail } from "./jobMatchEmail.js";

dotenv.config();

// Configure Brevo API client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Helper function to send email via API
const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await transactionalEmailsApi.sendTransacEmail({
      sender: { name: process.env.EMAIL_FROM_NAME, email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    console.log(`✅ Email sent to ${to}: ${subject}`);
    return response;
  } catch (error) {
    console.error("❌ Brevo API send failed:", error);
    throw error;
  }
};

// 🟢 WELCOME EMAIL
export const sendWelcomeEmail = (to, name) => {
  const html = generateWelcomeEmail(name);
  return sendEmail({ to, subject: "Welcome to JobHub 🎉", html });
};

// 🟢 LOGIN EMAIL
export const sendLoginEmail = (to, name) => {
  const html = `
    <div style="font-family: Arial; background:#f6f8fb; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px;">
        <div style="background:#3B4AA3; color:#fff; padding:18px 24px; text-align:center;">
          <h2>Login Alert</h2>
        </div>
        <div style="padding:20px; color:#333;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>You’ve successfully logged in to <strong>JobHub</strong>.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: "Login Successful - JobHub", html });
};

// 🟢 RESET PASSWORD EMAIL
export const sendResetPasswordEmail = (to, name, resetLink) => {
  const html = generateResetPasswordEmail(name, resetLink);
  return sendEmail({ to, subject: "Reset Your JobHub Password 🔒", html });
};

// 🟢 JOB MATCH EMAIL
export const sendJobMatchEmail = (to, name, matchedJobs) => {
  const html = generateJobMatchEmail(name, matchedJobs);
  return sendEmail({ to, subject: "🎯 New Job Matches for You | JobHub", html });
};

// 🟢 JOB APPLICATION THANK YOU EMAIL
export const sendJobApplicationEmail = (to, name, jobTitle, company) => {
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f8fb; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
      <div style="background:#3B4AA3; color:#fff; padding:18px 24px; text-align:center;">
        <img src="https://ai-powered-job-matching-platform.onrender.com/public/logo.png" alt="JobHub Logo" style="width:100px; margin-bottom:10px;" />
        <h2 style="margin:0;">Application Received!</h2>
      </div>
      <div style="padding:20px; color:#333;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for applying for <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
        <p>Your application is under review. We encourage you to check your JobHub dashboard for updates.</p>
        <div style="text-align:center; margin:20px 0;">
          <a href="https://global-jobhub.vercel.app" style="background:#3B4AA3; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold;">View Applications</a>
        </div>
        <p style="font-size:12px; color:#666;">We’ll notify you once there’s an update regarding your application.</p>
      </div>
      <div style="background:#f1f3f7; text-align:center; padding:12px; font-size:12px; color:#666;">
        © ${new Date().getFullYear()} JobHub. All rights reserved.
      </div>
    </div>
  </div>
  `;
  return sendEmail({ to, subject: `✅ Application Received | ${jobTitle}`, html });
};
