// Backend/utils/jobApplicationEmail.js

export const generateJobApplicationEmail = (userName, jobTitle, companyName) => {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f8fb; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
      <div style="background:#3B4AA3; color:#fff; padding:18px 24px; text-align:center;">
        <img src="https://ai-powered-job-matching-platform.onrender.com/public/logo.png" alt="JobHub Logo" style="width:100px; margin-bottom:10px;" />
        <h2 style="margin:0;">Application Received!</h2>
      </div>
      <div style="padding:20px; color:#333;">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Thank you for applying to <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
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
};
