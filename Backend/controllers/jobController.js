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
/**
 * @desc Get all job applications of a jobseeker
 * @route GET /api/jobseeker/applications
 * @access Private (Jobseeker)
 */
export const getJobseekerApplications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const applications = await Applicant.find({ user: userId })
    .populate("job", "title company location")
    .sort({ createdAt: -1 });

  res.status(200).json(applications);
});

/**
 * @desc Withdraw a job application
 * @route DELETE /api/jobs/jobseeker/applications/:id
 * @access Private (Jobseeker)
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Applicant.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Ensure user owns this application
  if (application.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to withdraw this application");
  }

  await application.deleteOne();

  res.status(200).json({ message: "Application withdrawn successfully" });
});

/**
 * @desc Get jobseeker dashboard statistics
 * @route GET /api/jobs/dashboard
 * @access Private (Jobseeker)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Count active applications
    const activeApplications = await Applicant.countDocuments({ user: userId });

    // 2️⃣ Count matched jobs (by skill overlap)
    const user = await Job.findById(userId).populate("user");
    let matchedJobs = 0;
    if (req.user?.skills && req.user.skills.length > 0) {
      matchedJobs = await Job.countDocuments({
        required_skills: { $in: req.user.skills },
      });
    }

    // 3️⃣ Placeholder for messages (implement later if you add messageModel)
    const messages = 0;

    // 4️⃣ Calculate profile completion (example logic)
    const profileFields = ["name", "email", "phone", "skills", "resume"];
    let filled = profileFields.filter((field) => req.user[field]).length;
    const profileCompletion = Math.round((filled / profileFields.length) * 100);

    res.json({
      activeApplications,
      matchedJobs,
      messages,
      profileCompletion,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
};





