import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
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
// import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
/**
 * ✅ App.jsx — Routing structure for all pages.
 */
function App() {
  return (
    <>
      {/* Navbar visible on all pages */}
      <Navbar />

      <main style={styles.main}>
        <Routes>
          {/* 🏠 Root — redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 🔐 Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 👨‍💼 Job Seeker */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/BrowseJobs" element={<BrowseJobs />} />
          <Route path="/ai" element={<AIMatch />} />
          <Route path="/jobseeker/dashboard" element={<JobseekerDashboard />} />
          

          {/* 🧑‍💼 Employer */}
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
          {/* <Route path="/employer/Createjob" element={<CreateJob />} />  */}

          {/* * ⚠️ Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  );
}

/**
 * 🎨 Global Layout Styles
 */
const styles = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
  },
};

export default App;
