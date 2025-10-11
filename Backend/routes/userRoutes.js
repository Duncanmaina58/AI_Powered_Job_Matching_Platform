import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
   registerUser, 
   loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  upload, 
  uploadAvatar,
} from "../controllers/userController.js";




const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put('/update-profile/:id', updateUserProfile);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);
router.put("/update-profile", protect, updateUserProfile);

router.get("/profile", protect, getUserProfile);


// ✅ Update logged-in user profile
router.put("/profile", protect, updateUserProfile);

// ✅ Change password
router.put("/change-password", protect, changeUserPassword);
export default router;
