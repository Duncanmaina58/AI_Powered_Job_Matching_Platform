import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Google Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("✅ Google Auth Callback hit!");
    console.log("✅ Google Auth User:", req.user);

    if (!req.user || !req.user._id) {
      console.error("❌ No user found after Google login");
      return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
    }

    const token = jwt.sign(
      { id: req.user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("🟢 Issued Token:", token);
    console.log("➡️ Redirecting to:", `${process.env.CLIENT_URL}/auth/success?token=${token}`);

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);



// ✅ Logout Route
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
