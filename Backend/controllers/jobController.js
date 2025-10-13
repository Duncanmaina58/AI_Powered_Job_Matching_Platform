// Backend/controllers/jobController.js

import Job from "../models/Job.js";
import asyncHandler from "express-async-handler";
import Applicant from "../models/Applicant.js";

// Helper function to get company name
const getCompanyName = (req) => req.user.company_name || "N/A Company Name";

/**
 * @desc Get all jobs (Public)
 * @route GET /api/jobs
 * @access Public
 */
export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate("user", "name email");
  res.status(200).json(jobs);
});

/**
 * @desc Create a new job (Employer only)
 * @route POST /api/jobs
 * @access Private
 */
export const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, required_skills, salary_range } = req.body;

  if (!title || !description || !required_skills) {
    res.status(400);
    throw new Error("Please include job title, description, and required skills.");
  }

  const job = new Job({
    title,
    description,
    user: req.user._id,
    company: getCompanyName(req),
    location,
    required_skills,
    salary_range,
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
});

/**
 * @desc Get jobs created by logged-in employer
 * @route GET /api/jobs/employer
 * @access Private
 */
export const getEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(jobs);
});

/**
 * @desc Get single job by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("user", "name email");
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.status(200).json(job);
});

/**
 * @desc Update a job
 * @route PUT /api/jobs/:id
 * @access Private
 */
export const updateJob = asyncHandler(async (req, res) => {
  const { title, description, location, required_skills, salary_range, status } = req.body;

  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this job");
  }

  job.title = title ?? job.title;
  job.description = description ?? job.description;
  job.location = location ?? job.location;
  job.required_skills = required_skills ?? job.required_skills;
  job.salary_range = salary_range ?? job.salary_range;
  job.status = status ?? job.status;

  const updatedJob = await job.save();
  res.status(200).json(updatedJob);
});

/**
 * @desc Delete a job
 * @route DELETE /api/jobs/:id
 * @access Private
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this job");
  }

  await job.deleteOne();
  res.status(200).json({ message: "Job removed successfully" });
});

/**
 * @desc Apply for a job
 * @route POST /api/jobs/:id/apply
 * @access Private (Jobseeker)
 */
export const applyForJob = asyncHandler(async (req, res) => {
  const { name, email, coverLetter, cv } = req.body;
  const jobId = req.params.id;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const alreadyApplied = await Applicant.findOne({ job: jobId, email });
  if (alreadyApplied) {
    res.status(400);
    throw new Error("You have already applied for this job.");
  }

  const applicant = await Applicant.create({
    job: jobId,
    name,
    email,
    coverLetter,
    cv,
    user: req.user ? req.user._id : null,
  });

  job.applicants.push(applicant._id);
  await job.save();

  res.status(201).json({
    message: "Application submitted successfully!",
    applicant,
  });
});

/**
 * @desc Get applicants for a job
 * @route GET /api/jobs/:id/applicants
 * @access Private (Employer)
 */
export const getJobApplicants = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  const job = await Job.findById(jobId).populate({
    path: "applicants",
    populate: { path: "user", select: "name email resume" },
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to view applicants for this job");
  }

  res.status(200).json({
    jobTitle: job.title,
    totalApplicants: job.applicants.length,
    applicants: job.applicants,
  });
});
