import asyncHandler from "express-async-handler";
import Job from "../models/job.js";
import User from "../models/User.js";

/**
 * @desc Suggest jobs to a jobseeker based on their skills and preferences
 * @route GET /api/match/jobs
 * @access Private (Jobseeker only)
 */
export const matchJobsForUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== "jobseeker") {
    res.status(403);
    throw new Error("Access denied. Only jobseekers can access this route.");
  }

  // Example logic — match jobs based on skills or preferred location
  const criteria = [];

  if (user.skills && user.skills.length > 0) {
    criteria.push({ skills: { $in: user.skills } });
  }

  if (user.location) {
    criteria.push({ location: user.location });
  }

  const jobs = await Job.find({
    $or: criteria.length > 0 ? criteria : [{}],
  }).limit(10);

  res.json({
    user: user.name,
    matched_jobs: jobs,
  });
});

/**
 * @desc Suggest candidates for an employer based on job requirements
 * @route GET /api/match/candidates/:jobId
 * @access Private (Employer only)
 */
export const matchCandidatesForJob = asyncHandler(async (req, res) => {
  const employer = await User.findById(req.user._id);
  const job = await Job.findById(req.params.jobId);

  if (!employer || employer.role !== "employer") {
    res.status(403);
    throw new Error("Access denied. Only employers can access this route.");
  }

  if (!job) {
    res.status(404);
    throw new Error("Job not found.");
  }

  // Match jobseekers whose skills fit this job
  const candidates = await User.find({
    role: "jobseeker",
    skills: { $in: job.skills },
  }).limit(10);

  res.json({
    job: job.title,
    matched_candidates: candidates,
  });
});
