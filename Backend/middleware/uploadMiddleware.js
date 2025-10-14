// Backend/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Create upload directories if they don't exist
const uploadDir = "uploads/profile";
const resumeDir = "uploads/resume";

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });

// ✅ Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, uploadDir);
    } else if (file.fieldname === "resume") {
      cb(null, resumeDir);
    } else {
      cb(new Error("Invalid field name"));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// ✅ File filter: allow only images and PDFs
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profileImage") {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed for profile image"), false);
  } else if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed for resume"), false);
  } else {
    cb(new Error("Invalid field name"), false);
  }
};

export const upload = multer({ storage, fileFilter });
