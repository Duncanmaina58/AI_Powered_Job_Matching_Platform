import express from "express";


import {
   registerUser, 
   loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  upload, 
  uploadAvatar,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);
router.put('/update-profile/:id', updateUserProfile);
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);
router.put("/update-profile", protect, updateUserProfile);




// ✅ Update logged-in user profile
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

// ✅ Change password
router.put("/change-password", protect, changeUserPassword);
export default router;
