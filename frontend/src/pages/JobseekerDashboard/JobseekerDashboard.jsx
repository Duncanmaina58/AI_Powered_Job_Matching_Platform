// frontend/src/pages/JobseekerDashboard/JobseekerDashboard.jsx
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import BrowseJobs from "./BrowseJobs";
import Applications from "./MyApplications";
import Profile from "./Profile";
import axios from "axios";

function JobseekerDashboard() {
  const [active, setActive] = useState("overview");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
    profileCompletion: 0,
  });

  // Fetch user info from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserData();
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/jobseeker/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  // Decide what to show based on active state
  const renderContent = () => {
    switch (active) {
      case "overview":
        return <Overview />;
      case "browse":
        return <BrowseJobs />;
      case "applications":
        return <Applications />;
      case "profile":
        return <Profile />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <h1 className="text-xl font-semibold text-gray-700 capitalize">
            {active}
          </h1>
          <div className="text-gray-700 font-medium">
            {user ? user.name : "Loading..."}
          </div>
        </header>

        {/* Stats Summary Bar */}
        <section className="bg-white shadow-md mx-6 mt-4 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Jobs Applied</p>
            <h3 className="text-2xl font-bold text-blue-600">{stats.applied}</h3>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Saved Jobs</p>
            <h3 className="text-2xl font-bold text-green-600">{stats.saved}</h3>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Profile Completion</p>
            <h3 className="text-2xl font-bold text-yellow-600">
              {stats.profileCompletion}%
            </h3>
          </div>
        </section>

        {/* Main Section */}
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

export default JobseekerDashboard;
