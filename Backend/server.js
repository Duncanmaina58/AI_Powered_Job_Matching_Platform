import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import jobseekerRoutes from "./routes/jobseekerRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Correct CORS configuration (allow both localhost + Vercel)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://global-jobhub.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Root API route (test if backend is running)
app.get("/api", (req, res) => {
  res.send("✅ API is running! Available endpoints: /api/users, /api/jobs, /api/ai");
});

// ✅ Use all route files
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/applications", applicationRoutes);

// ✅ Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
