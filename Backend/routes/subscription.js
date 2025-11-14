// backend/routes/subscriptionRoutes.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

// Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2023-08-16",
// });

// Hardcoded subscription plans (price in USD cents for Stripe)
const subscriptionPlans = [
  {
    tier: "Free",
    price: 0,
    features: ["Basic Job Search"],
    stripePriceId: null,
  },
  {
    tier: "Premium Basic",
    price: 499, // Ksh 499
    features: ["Unlimited Applications", "Profile Boost", "Salary Insights"],
    stripePriceId: process.env.STRIPE_PREMIUM_BASIC_PRICE_ID,
  },
  {
    tier: "Premium Pro",
    price: 999, // Ksh 999
    features: ["Priority Support", "Featured Applications", "Portfolio Section"],
    stripePriceId: process.env.STRIPE_PREMIUM_PRO_PRICE_ID,
  },
];

// GET all plans
router.get("/plans", (req, res) => {
  res.json(subscriptionPlans);
});

// // Create Stripe Checkout Session
// router.post("/create-checkout-session", async (req, res) => {
//   const { userId, tier } = req.body;

//   try {
//     const plan = subscriptionPlans.find((p) => p.tier === tier);
//     if (!plan || !plan.stripePriceId) {
//       return res.status(400).json({ message: "Invalid subscription tier" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price: plan.stripePriceId,
//           quantity: 1,
//         },
//       ],
//       metadata: { userId, tier },
//       success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
//       cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create Stripe session" });
//   }
// });

// // Stripe webhook to update subscription after successful payment
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.log("⚠️ Webhook signature verification failed.", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const userId = session.metadata.userId;
//       const tier = session.metadata.tier;

//       const startDate = new Date();
//       const endDate = new Date();
//       endDate.setMonth(endDate.getMonth() + 1);

//       await User.findByIdAndUpdate(userId, {
//         subscription: { tier, startDate, endDate, status: "active", paymentId: session.payment_intent },
//       });

//       console.log(`✅ Subscription updated for user ${userId} to tier ${tier}`);
//     }

//     res.json({ received: true });
//   }
// );

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
