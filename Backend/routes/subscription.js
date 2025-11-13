import express from "express";
import User from "../models/User.js";
const router = express.Router();

// Hardcoded subscription plans
const subscriptionPlans = [
  { tier: "Free", price: 0, features: ["Basic Job Search"] },
  { tier: "Premium Basic", price: 9.99, features: ["Unlimited Applications", "Profile Boost", "Salary Insights"] },
  { tier: "Premium Pro", price: 19.99, features: ["Priority Support", "Featured Applications", "Portfolio Section"] },
];

// GET all plans
router.get("/plans", (req, res) => {
  res.json(subscriptionPlans);
});

// Create subscription (after payment)
router.post("/create", async (req, res) => {
  const { userId, tier, paymentId } = req.body;
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1-month subscription

    await User.findByIdAndUpdate(userId, {
      subscription: { tier, startDate, endDate, status: "active", paymentId },
    });

    res.json({ message: "Subscription created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// GET subscription status
router.get("/status/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user.subscription || { tier: "Free", status: "active" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get subscription status" });
  }
});

export default router;
