import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
// 💡 NOTE: We no longer need to import bcryptjs here since it's only used in the User.js model.
// import bcrypt from "bcryptjs"; 

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

  console.log("🧠 Login attempt:", { email: normalizedEmail, role });

  // 💡 NOTE: Your login function currently uses bcrypt.compare directly,
  // which is fine, but you could also use the custom method (user.matchPassword(password)) 
  // you defined in User.js if you prefer. I've left the original logic here:
  
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    console.log("❌ No user found with that email");
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // This comparison now works correctly against the single-hashed password!
  const isMatch = await user.matchPassword(password); 
  // NOTE: If you are using 'bcrypt.compare(password, user.password);' directly, that's fine too.

  if (!isMatch) {
    console.log("❌ Invalid password for:", normalizedEmail);
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (role && role !== user.role) {
    console.log("❌ Role mismatch:", { selected: role, actual: user.role });
    res.status(403);
    throw new Error("Incorrect role selected");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  console.log("✅ Login successful for:", user.email);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});


/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Update logged-in user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.company = req.body.company || user.company;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      company: updatedUser.company,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changeUserPassword = asyncHandler(async (req, res) => {
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

export { getUserProfile, updateUserProfile, changeUserPassword };



// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/avatars/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb("Images only!");
  },
});


// ✅ Upload Avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imagePath = `/uploads/avatars/${req.file.filename}`;

    req.user.avatar = imagePath;
    await req.user.save();

    res.json({ message: "Avatar uploaded successfully", avatar: imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};