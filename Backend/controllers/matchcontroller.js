// controllers/matchcontroller.js
import asyncHandler from "express-async-handler";
import Job from "../models/job.js";
import User from "../models/User.js";

/**
 * @desc Suggest jobs to a jobseeker based on their skills and preferences
 * @route GET /api/ai/match/jobs
 * @access Private (Jobseeker only)
 */
export const matchJobsForUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "jobseeker") {
      return res.status(403).json({ message: "Access denied. Jobseekers only." });
    }

    // Ensure skills exist and is an array
    const userSkills = Array.isArray(user.skills) ? user.skills : [];

    if (userSkills.length === 0) {
      return res.json({ matched_jobs: [] });
    }

    // Find jobs that share at least one skill
 // controllers/matchController.js
const jobs = await Job.find({
  required_skills: { $in: userSkills },
});

const matchedJobs = jobs.map((job) => {
  const jobSkills = Array.isArray(job.required_skills) ? job.required_skills : [];
  const matchedSkills = jobSkills.filter((skill) => userSkills.includes(skill));
  const matchScore = Math.round((matchedSkills.length / jobSkills.length) * 100);

  return {
    ...job._doc,
    matchScore,
    matchedSkills,
  };
});


    // Sort by best match
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ user: user.name, matched_jobs: matchedJobs });
  } catch (error) {
    console.error("Error in matchJobsForUser:", error);
    res.status(500).json({ message: "Server error during AI matching", error: error.message });
  }
});

/**
 * @desc Suggest candidates for an employer based on job requirements
 * @route GET /api/ai/match/candidates/:jobId
 * @access Private (Employer only)
 */
export const matchCandidatesForJob = asyncHandler(async (req, res) => {
  try {
    const employer = await User.findById(req.user._id);
    const job = await Job.findById(req.params.jobId);

    if (!employer || employer.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employers only." });
    }

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Find jobseekers whose skills intersect with job requirements
    const candidates = await User.find({
      role: "jobseeker",
      skills: { $in: job.skills },
    });

    res.json({
      job: job.title,
      matched_candidates: candidates,
    });
  } catch (error) {
    console.error("Error in matchCandidatesForJob:", error);
    res.status(500).json({ message: "Server error during candidate matching" });
  }
});
