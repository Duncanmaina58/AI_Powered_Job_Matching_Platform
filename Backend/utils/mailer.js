// Backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateWelcomeEmail } from "./welcomeEmail.js";
import { generateResetPasswordEmail } from "./resetPasswordEmail.js";
import { generateJobMatchEmail } from "./jobMatchEmail.js";
import { generateJobApplicationEmail } from "./jobApplicationEmail.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "TLSv1.2",
  },
});

transporter.verify((err, success) => {
  if (err) console.error("❌ Nodemailer verify failed:", err);
  else console.log("✅ Nodemailer ready to send (Gmail SMTP)");
});

// 🟢 WELCOME EMAIL
export const sendWelcomeEmail = async (to, name) => {
  const html = generateWelcomeEmail(name);
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "JobHub"}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to JobHub 🎉",
    html,
  });
};

// 🟢 LOGIN EMAIL
export const sendLoginEmail = async (to, name) => {
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f8fb; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px;">
        <div style="background:#3B4AA3; color:#fff; padding:18px 24px;">
          <h2>Login Alert</h2>
        </div>
        <div style="padding:20px; color:#333;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>You’ve successfully logged in to your <strong>JobHub</strong> account.</p>
          <p>If this wasn’t you, please reset your password immediately.</p>
        </div>
        <div style="background:#f1f3f7; text-align:center; padding:12px; font-size:12px; color:#666;">
          © ${new Date().getFullYear()} JobHub. All rights reserved.
        </div>
      </div>
    </div>
  `;
  return transporter.sendMail({
    from: `"JobHub" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Login Successful - JobHub",
    html,
  });
};

// 🟢 RESET PASSWORD EMAIL
export const sendResetPasswordEmail = async (to, name, resetLink) => {
  const html = generateResetPasswordEmail(name, resetLink);
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "JobHub Support"}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your JobHub Password 🔒",
    html,
  });
};




// 🟢 JOB MATCH EMAIL
export const sendJobMatchEmail = async (to, name, matchedJobs) => {
  const html = generateJobMatchEmail(name, matchedJobs);
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "JobHub"}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎯 New Job Matches for You | JobHub`,
    html,
  });
};




// 🟢 JOB APPLICATION EMAIL
export const sendJobApplicationEmail = async (to, name, jobTitle, companyName) => {
  const html = generateJobApplicationEmail(name, jobTitle, companyName);
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "JobHub"}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `✅ Application Received: ${jobTitle} | JobHub`,
    html,
  });
};
