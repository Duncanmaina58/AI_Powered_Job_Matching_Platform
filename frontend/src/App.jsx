// ✅ App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import socket from "./utils/socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import AIMatch from "./pages/AIMatch";
import Navbar from "./components/Navbar";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import MyJobs from "./pages/MyJobs";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ApplicantsPage from "./pages/ApplicantsPage";
import BrowseJobs from "./pages/JobseekerDashboard/BrowseJobs";
import JobseekerDashboard from "./pages/JobseekerDashboard/JobseekerDashboard";
import ViewApplicants from "./pages/ViewApplicants";
import EditJob from "./pages/EditJob";
import ThemeProvider from "./Theme/ThemeProvider";
import AuthSuccess from "./pages/AuthSuccess";
import LandingPage from "./pages/LandingPage";

// frontend/src/App.jsx or wherever your routes are
import ApplyJob from "./pages/JobseekerDashboard/ApplyJob.jsx";



function App() {
  // ✅ Setup socket and toast notifications
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.token || !userInfo._id) {
      if (socket && socket.connected) socket.disconnect();
      return;
    }

    // connect socket
    socket.connect();

    // register the user on the backend via token
    socket.emit("registerUser", { token: userInfo.token });

    // listen for notifications from server
    socket.on("newNotification", (payload) => {
      const msg = payload?.message || "You have a new notification";
      const type = payload?.type || "info";

      if (type === "success") toast.success(msg);
      else if (type === "warning") toast.warn(msg);
      else if (type === "error") toast.error(msg);
      else toast.info(msg);
    });

    // optional debugging
    socket.on("connect", () => console.log("🔌 Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));

    return () => {
      socket.off("newNotification");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <Navbar />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/LandingPage" replace />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          {/* Job Seeker */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/BrowseJobs" element={<BrowseJobs />} />
          <Route path="/ai" element={<AIMatch />} />
          <Route path="/jobseeker/dashboard" element={<JobseekerDashboard />} />
          <Route path="/apply-job/:id" element={<ApplyJob />} />


          {/* Employer */}
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/manage-jobs" element={<ManageJobs />} />
          <Route path="/employer/my-jobs" element={<MyJobs />} />
          <Route path="/employer/settings" element={<Settings />} />
          <Route path="/employer/profile" element={<Profile />} />
          <Route path="/employer/edit-job/:id" element={<EditJob />} />
          <Route path="/employer/job/:id/applicants" element={<ApplicantsPage />} />
          <Route path="/employer/jobs/:jobId/applicants" element={<ViewApplicants />} />
          <Route path="/employer/jobs/:id/applicants" element={<ViewApplicants />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/LandingPage" replace />} />
        </Routes>
      </main>

      {/* Toast container for notifications */}
      <ToastContainer position="bottom-right" autoClose={5000} />
    </ThemeProvider>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
  },
};

export default App;
