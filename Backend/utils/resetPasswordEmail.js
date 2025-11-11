// Backend/utils/resetPasswordEmail.js

export const generateResetPasswordEmail = (name, resetLink) => `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f8fb; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
      <div style="background:#3B4AA3; color:#fff; padding:18px 24px;">
        <h1 style="margin:0; font-size:20px;">Reset Your Password</h1>
      </div>
      <div style="padding:20px; color:#333;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>We received a request to reset your <strong>JobHub</strong> account password.</p>
        <p>Click the button below to choose a new password:</p>

        <div style="text-align:center; margin:24px 0;">
          <a href="${resetLink}" style="background:#3B4AA3; color:white; padding:12px 25px; border-radius:6px; text-decoration:none;">
            Reset Password
          </a>
        </div>

        <p>If you didn’t request this change, you can safely ignore this email. Your password will remain the same.</p>

        <p style="margin-top:18px;">Stay secure,<br/><strong>The JobHub Team</strong></p>
      </div>
      <div style="background:#f1f3f7; text-align:center; padding:12px; font-size:12px; color:#666;">
        © ${new Date().getFullYear()} JobHub. All rights reserved.
      </div>
    </div>
  </div>
`;
