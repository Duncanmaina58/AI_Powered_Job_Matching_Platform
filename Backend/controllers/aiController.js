import Job from "../models/Job.js";
import User from "../models/User.js";

// Simple skill-based AI matching
export const matchJobsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const jobs = await Job.find();

    // Compute match score based on skills overlap
    const matchedJobs = jobs.map(job => {
      const matchingSkills = job.skills.filter(skill =>
        user.skills.includes(skill)
      );
      const score = matchingSkills.length / job.skills.length; // simple ratio
      return { ...job.toObject(), matchScore: score.toFixed(2) };
    });

    // Sort by highest score first
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
