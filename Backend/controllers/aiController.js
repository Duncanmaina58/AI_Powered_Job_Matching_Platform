import User from "../models/User.js";
import Job from "../models/job.js";

export const getAIMatchedJobs = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Check if user has skills
    if (!user.skills || user.skills.length === 0)
      return res.status(200).json({
        success: true,
        message: "No skills found in your profile",
        matchedJobs: [],
      });

    // 3. Get all jobs
    const jobs = await Job.find();

    // 4. Match logic: job.skills intersect user.skills
    const matchedJobs = jobs.filter((job) => {
      if (!job.skills || job.skills.length === 0) return false;

      const jobSkills = job.skills.map((s) => s.toLowerCase());
      const userSkills = user.skills.map((s) => s.toLowerCase());

      // Check if any skill overlaps
      return jobSkills.some((skill) => userSkills.includes(skill));
    });

    // 5. Return results
    res.status(200).json({
      success: true,
      totalMatches: matchedJobs.length,
      matchedJobs,
    });
  } catch (error) {
    console.error("AI Match Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
