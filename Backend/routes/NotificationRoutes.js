import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotifications, markAsRead, getUserNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications); // get all notifications for user
router.put("/read/:id", protect, markAsRead); // mark a notification as read
// routes/notificationRoutes.js
router.get("/me", protect, getUserNotifications);

export default router;
