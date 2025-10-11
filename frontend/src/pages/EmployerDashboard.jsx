import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  PlusCircle,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  DollarSign,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch Employer Jobs Only (Authorized)
  const fetchEmployerJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/jobs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setError("❌ Could not fetch your job listings. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  // 🧮 Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === "Active").length;
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🗑️ Delete Job (Authorized)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Job deleted successfully!");
      // Refresh job list
      fetchEmployerJobs();
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("❌ Could not delete job. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 relative">
      {/* 📌 Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r shadow-sm flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">JobHub Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<Briefcase size={20} />} text="Dashboard" to="/employer/dashboard" onClick={() => setSidebarOpen(false)} />
          <NavItem icon={<PlusCircle size={20} />} text="Create Job" to="/employer/post-job" onClick={() => setSidebarOpen(false)} />
          <NavItem icon={<Users size={20} />} text="My Jobs" to="/employer/my-jobs" onClick={() => setSidebarOpen(false)} />
          <NavItem icon={<Settings size={20} />} text="Settings" to="/employer/settings" onClick={() => setSidebarOpen(false)} />
        </nav>

        <div className="border-t px-4 py-4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* 🔲 Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"></div>
      )}

      {/* 📊 Main */}
      <main className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-700 hover:text-blue-600" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold">Employer Dashboard</h2>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-gray-600 hover:text-blue-600">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <img src="https://i.pravatar.cc/40" alt="Profile" className="w-9 h-9 rounded-full border border-gray-200" />
              <span className="text-sm font-medium">Duncan</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Overview</h3>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Jobs" value={loading ? "..." : totalJobs} icon={<Briefcase className="text-blue-500" size={26} />} />
            <StatCard title="Active Jobs" value={loading ? "..." : activeJobs} icon={<PlusCircle className="text-green-500" size={26} />} />
            <StatCard title="Applicants" value={loading ? "..." : totalApplicants} icon={<Users className="text-purple-500" size={26} />} />
          </div>

          {/* Recent Jobs */}
          <div className="mt-10 bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-gray-700 text-lg">Recent Job Posts</h4>
              <NavLink
                to="/employer/post-job"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                <PlusCircle size={16} /> Add New Job
              </NavLink>
            </div>

            {loading ? (
              <p className="text-gray-500 text-center py-10">Loading jobs...</p>
            ) : error ? (
              <p className="text-red-500 text-center py-10">{error}</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No jobs found. Try posting one.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-gradient-to-br from-white to-blue-50 border border-gray-100 rounded-2xl p-5 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-lg font-semibold text-gray-800">{job.title}</h5>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          job.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {job.status || "Pending"}
                      </span>
                    </div>

                    <div className="space-y-2 text-gray-600 text-sm">
                      <p className="flex items-center gap-2">
                        <Building2 size={16} className="text-blue-500" /> {job.company || "N/A"}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-red-500" /> {job.location || "N/A"}
                      </p>
                      <p className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        {job.salary_range?.min && job.salary_range?.max
                          ? `KSH ${job.salary_range.min.toLocaleString()} - ${job.salary_range.max.toLocaleString()}`
                          : "Not specified"}
                      </p>
                    </div>

                    <p className="text-gray-700 mt-3 text-sm line-clamp-3">{job.description}</p>

                    <div className="flex justify-between items-center mt-5">
                      <button
                        onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// 📦 Components
const NavItem = ({ icon, text, to, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-100 text-blue-700 font-medium shadow-inner"
          : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
      }`
    }
  >
    {icon}
    {text}
  </NavLink>
);

const StatCard = ({ title, value, icon }) => (
  <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition-all duration-200">
    <div>
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
    <div className="p-3 bg-blue-50 rounded-full">{icon}</div>
  </div>
);
