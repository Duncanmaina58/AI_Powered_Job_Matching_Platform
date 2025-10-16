import JobApplication from "../models/Applicant.js";
import User from "../models/User.js";
import Applicant from "../models/Applicant.js";
import Job from "../models/job.js"; 
import path from "path";
import fs from "fs";

// Uncomment this if you have a messages model
// import Message from "../models/messageModel.js";

export const getJobseekerStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Count total job applications
    const activeApplications = await JobApplication.countDocuments({ user: userId });

    // 2️⃣ Example: count matched jobs based on user skills
    const user = await User.findById(userId);
    let matchedJobs = 0;
    if (user?.skills?.length > 0) {
      matchedJobs = await Job.countDocuments({
        requiredSkills: { $in: user.skills },
      });
    }

    // 3️⃣ Messages count (set to 0 if not implemented)
    const messages = 0;

    // 4️⃣ Calculate profile completion percentage
    const fields = ["name", "email", "skills", "resume", "bio"];
    const filled = fields.filter((field) => user && user[field]);
    const profileCompletion = `${Math.round((filled.length / fields.length) * 100)}%`;

    // ✅ Return stats to frontend
    res.json({
      activeApplications,
      matchedJobs,
      messages,
      profileCompletion,
    });
  } catch (error) {
    console.error("Error fetching jobseeker stats:", error);
    res.status(500).json({ message: "Failed to fetch jobseeker stats" });
  }
};


// ✅ GET /api/jobseeker/profile
// Backend/controllers/jobseekerController.js



export const getJobseekerProfile = async (req, res) => {
  try {
    console.log("Fetching jobseeker profile for:", req.user?.id);

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const applications = await Applicant.find({ user: req.user.id })
      .populate("job", "title company_name status")
      .sort({ createdAt: -1 });

    res.json({
      ...user._doc,
      applications,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateJobseekerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, bio, skills } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(",");

    // ✅ Handle uploads
    if (req.files?.profileImage) {
      user.profileImage = `/uploads/profile/${req.files.profileImage[0].filename}`;
    }
    if (req.files?.resume) {
      user.resume = `/uploads/resume/${req.files.resume[0].filename}`;
    }

    const updatedUser = await user.save();
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟢 Upload Profile Files (for POST /upload)
export const uploadProfileFiles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.files?.profileImage) {
      user.profileImage = `/uploads/profile/${req.files.profileImage[0].filename}`;
    }
    if (req.files?.resume) {
      user.resume = `/uploads/resume/${req.files.resume[0].filename}`;
    }

    await user.save();
    res.json({ message: "Files uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};



export const getAIMatchedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🧩 Simple matching: jobs containing at least one of user’s skills
    const matchedJobs = await Job.find({
      requiredSkills: { $in: user.skills },
    }).limit(10);

    // Add match percentage based on number of matching skills
    const jobsWithMatchScore = matchedJobs.map((job) => {
      const commonSkills = job.requiredSkills.filter((skill) =>
        user.skills.includes(skill)
      );
      const matchScore = Math.round(
        (commonSkills.length / job.requiredSkills.length) * 100
      );
      return { ...job._doc, matchScore };
    });

    res.json(jobsWithMatchScore);
  } catch (error) {
    console.error("Error in AI match:", error);
    res.status(500).json({ message: "Failed to fetch AI matched jobs" });
  }
};
