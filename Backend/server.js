// ✅ server.js
import express from "express";
import http from "http"; // ✅ Needed for socket.io
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import jobseekerRoutes from "./routes/jobseekerRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/NotificationRoutes.js";
// 🛡️ Security middlewares
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import matchRoutes from "./routes/matchRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Allowlist for frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://global-jobhub.vercel.app",
];



app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use("/uploads", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Enable CORS for uploads as well
app.use("/uploads", cors({
  origin: ["http://localhost:5173", "https://global-jobhub.vercel.app"],
  credentials: true,
}));


// ✅ Serve static files (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));




// ✅ Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





// ✅ Security
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ Body parser
app.use(express.json());

// ✅ Root check route
app.get("/api", (req, res) => {
  res.send(`✅ API is running in ${process.env.NODE_ENV} mode!`);
});

// ✅ Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/match", matchRoutes);
// ✅ Start server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://global-jobhub.vercel.app"
    ],
    methods: ["GET", "POST"]
  },
});

// Map to track online users: userId -> socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("registerUser", (payload) => {
    try {
      // payload may be { token } or { userId }
      if (payload && payload.token) {
        const decoded = jwt.verify(payload.token, process.env.JWT_SECRET);
        if (decoded?.id) {
          onlineUsers.set(decoded.id, socket.id);
          console.log("✅ Registered user via token:", decoded.id);
        }
      } else if (payload && payload.userId) {
        onlineUsers.set(payload.userId, socket.id);
        console.log("✅ Registered user via id:", payload.userId);
      }
    } catch (err) {
      console.warn("registerUser failed:", err.message);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        console.log("User disconnected:", userId);
        break;
      }
    }
  });
});
// Export io and onlineUsers if you want to use them in controllers
export { io, onlineUsers };

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} on port ${PORT}`);
});