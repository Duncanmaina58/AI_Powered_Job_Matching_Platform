export const generateWelcomeEmail = (name) => `
  <div style="background-color: #f4f6f8; padding: 40px 0; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background-color: #3B4AA3; text-align: center; padding: 20px;">
        <img src="https://ai-powered-job-matching-platform.onrender.com/public/logo.png" alt="JobHUB Logo" style="width: 120px; margin-bottom: 10px;" />
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Welcome to JobHUB!</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #333333;">
        <h2 style="color: #3B4AA3;">Hi ${name},</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          Welcome to <strong>JobHUB</strong> — your one-stop platform for career growth and job opportunities.
          We’re thrilled to have you join our community of job seekers, employers, and professionals.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Start exploring exciting roles, connect with companies, and manage your job applications — all in one place.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://global-jobhub.vercel.app/login" 
             style="background-color: #3B4AA3; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 16px;">
             Go to Dashboard
          </a>
        </div>

        <p style="font-size: 14px; color: #555;">
          Need help? Reach us at 
          <a href="mailto:support@jobhub.com" style="color: #3B4AA3; text-decoration: none;">support@jobhub.com</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f3f6; text-align: center; padding: 15px; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} JobHUB. All rights reserved.
      </div>

    </div>
  </div>
`;
