import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";

/**
 * @desc Register a new user (Employer or Jobseeker)
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, company_name } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please fill all fields (name, email, password, role)");
  }

  // Require company name only for employers
  if (role === "employer" && !company_name) {
    res.status(400);
    throw new Error("Company name is required for employers");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password, // handled by pre('save')
    role,
    company_name: role === "employer" ? company_name : undefined,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company_name: user.company_name,
    token,
  });
});

/**
 * @desc Authenticate user & get token (with role)
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (role && role !== user.role) {
    res.status(403);
    throw new Error("Incorrect role selected");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

/**
 * @desc Get logged-in user's profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc Update logged-in user's profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.company_name = req.body.company_name || user.company_name;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      company_name: updatedUser.company_name,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc Change password
 * @route PUT /api/users/change-password
 * @access Private
 */
export const changeUserPassword = asyncHandler(async (req, res) => {
  const { current, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(current, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ message: "Password changed successfully" });
});

/* ==========================
   MULTER CONFIGURATION
========================== */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "avatar") cb(null, "uploads/avatars/");
    else if (file.fieldname === "logo") cb(null, "uploads/logos/");
    else if (file.fieldname === "resume") cb(null, "uploads/resumes/");
    else cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowedTypes = /jpg|jpeg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb("Only image or PDF files allowed!");
  },
});

/**
 * @desc Upload avatar
 * @route POST /api/users/upload-avatar
 * @access Private
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  const imagePath = `/uploads/avatars/${req.file.filename}`;
  req.user.avatar = imagePath;
  await req.user.save();

  res.json({ message: "Avatar uploaded successfully", avatar: imagePath });
});

/**
 * @desc Upload company logo
 * @route POST /api/users/upload-logo
 * @access Private
 */
export const uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No logo uploaded" });

  const logoPath = `/uploads/logos/${req.file.filename}`;
  req.user.company_logo = logoPath;
  await req.user.save();

  res.json({ message: "Company logo uploaded successfully", logo: logoPath });
});

/**
 * @desc Upload resume
 * @route POST /api/users/upload-resume
 * @access Private
 */
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No resume uploaded" });

  const resumePath = `/uploads/resumes/${req.file.filename}`;
  req.user.resume = resumePath;
  await req.user.save();

  res.json({ message: "Resume uploaded successfully", resume: resumePath });
});
