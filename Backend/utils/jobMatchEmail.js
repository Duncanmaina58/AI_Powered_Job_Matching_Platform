export const generateJobMatchEmail = (userName, matchedJobs) => {
  const jobCards = matchedJobs
    .slice(0, 5) // show only top 5 matches
    .map(
      (job) => `
      <div style="background:#f9f9f9; border:1px solid #e0e0e0; border-radius:8px; padding:12px 16px; margin-bottom:12px; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
        <h3 style="margin:0 0 6px 0; font-size:16px; color:#3B4AA3;">${job.title}</h3>
        <p style="margin:0; font-size:14px; color:#555;">${job.company_name || "Unknown Company"}</p>
        <p style="margin:6px 0 0 0; font-size:13px; color:#777;">
          <strong>Matched Skills:</strong> ${job.matchedSkills.join(", ")}
        </p>
      </div>`
    )
    .join("");

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f8fb; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
      <div style="background:#3B4AA3; color:#fff; padding:24px 20px; text-align:center;">
        <img src="https://ai-powered-job-matching-platform.onrender.com/public/logo.png" alt="JobHub Logo" style="width:100px; margin-bottom:10px;" />

        <h2 style="margin:0; font-size:22px;">New Job Matches Just for You!</h2>
      </div>
      <div style="padding:24px 20px; color:#333;">
        <p style="font-size:14px;">Hi <strong>${userName}</strong>,</p>
        <p style="font-size:14px;">We’ve found <strong>${matchedJobs.length}</strong> new job(s) that match your skills!</p>
        ${jobCards}
        <div style="text-align:center; margin:20px 0;">
          <a href="https://global-jobhub.vercel.app" style="background:#3B4AA3; color:#fff; text-decoration:none; padding:12px 28px; border-radius:6px; font-weight:bold; font-size:14px;">View Jobs</a>
        </div>
        <p style="font-size:12px; color:#666; text-align:center;">Stay tuned for more opportunities that match your skills.</p>
      </div>
      <div style="background:#f1f3f7; text-align:center; padding:12px; font-size:12px; color:#666;">
        © ${new Date().getFullYear()} JobHub. All rights reserved.
      </div>
    </div>
  </div>
  `;
};
