// frontend/src/pages/JobseekerDashboard/Overview.jsx
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Search, MapPin, Clock } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

const Overview = ({ darkMode }) => {
  const [stats, setStats] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keep local theme state synced with parent darkMode prop
  const [isDark, setIsDark] = useState(darkMode);
  useEffect(() => {
    setIsDark(darkMode);
  }, [darkMode]);

  // Fetch user + stats
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        if (!token) {
          setError("⚠️ Please log in to view your dashboard.");
          setLoading(false);
          return;
        }

        const [profileRes, statsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/jobseeker/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/jobseeker/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(profileRes.data);
        const data = statsRes.data;
        setStats([
          { title: "Active Applications", value: data.activeApplications },
          { title: "Jobs Matched", value: data.matchedJobs },
          { title: "Messages", value: data.messages },
          { title: "Profile Completion", value: data.profileCompletion },
        ]);
      } catch {
        setError("❌ Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Search jobs
  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs?search=${search}`);
      setJobs(res.data);
    } catch {
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Welcome + Stats */}
      <motion.div className="px-6 lg:px-20 pt-10 pb-6" initial="hidden" animate="visible" variants={fadeInUp}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                : "/logo.png"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-blue-400 shadow-md"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold">Welcome back, {user?.name || "Jobseeker"} 👋</h2>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl shadow text-center border hover:shadow-lg transition ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h3 className={`${isDark ? "text-gray-400" : "text-gray-500"} font-medium`}>{s.title}</h3>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-2">
                {s.value ?? "--"}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hero / Search Section */}
      <section
        className={`py-16 px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 transition-colors ${
          isDark
            ? "bg-gradient-to-r from-gray-800 to-gray-700"
            : "bg-gradient-to-r from-blue-50 to-blue-100"
        }`}
      >
        <motion.div className="max-w-xl text-center lg:text-left">
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            We Have 200,000+ Live Jobs
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold mt-2 leading-snug">
            Your <span className="text-blue-600 dark:text-blue-400">Dream Job</span> Is Waiting For You
          </h1>

          <div
            className={`mt-6 shadow-md rounded-full flex items-center px-4 py-2 w-full max-w-lg mx-auto lg:mx-0 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Search className={`${isDark ? "text-gray-300" : "text-gray-400"}`} size={20} />
            <input
              type="text"
              placeholder="Job title, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`flex-1 px-3 py-2 border-none bg-transparent focus:ring-0 outline-none ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
            >
              Find Jobs
            </button>
          </div>
        </motion.div>

        <motion.div>
          <img src="/logo.png" alt="Job seeker" className="w-80 lg:w-[420px]" />
        </motion.div>
      </section>

      {/* Jobs Grid */}
      <div className="px-6 lg:px-20 py-12">
        {loading ? (
          <div className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>
            <Loader2 className="animate-spin inline-block mr-2" />
            Loading jobs...
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                className={`p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
                onClick={() => openModal(job)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <img
                    src={job.logo || "https://cdn-icons-png.flaticon.com/512/5968/5968292.png"}
                    alt={job.title}
                    className="w-12 h-12 rounded"
                  />
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold px-2 py-1 rounded">
                    {job.jobType}
                  </span>
                </div>
                <h3 className="mt-4 font-bold">{job.title}</h3>
                <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>
                  {job.company}
                </p>
                <p className="flex items-center text-sm mt-2">
                  <MapPin size={14} className="mr-1" /> {job.location}
                </p>
                <p className="flex items-center text-sm">
                  <Clock size={14} className="mr-1" /> {job.postedAt || "1 day ago"}
                </p>
                <p className="text-blue-700 dark:text-blue-400 font-bold mt-3">${job.salary}/month</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>
            No jobs found. Try another search.
          </p>
        )}
      </div>

      {/* Job Detail Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel
                className={`w-full max-w-lg p-6 rounded-2xl shadow-xl transition-colors ${
                  isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
              >
                <Dialog.Title className="text-xl font-bold mb-2">
                  {selectedJob?.title}
                </Dialog.Title>
                <p className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-4`}>
                  {selectedJob?.company}
                </p>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}>
                  {selectedJob?.description}
                </p>
                <div className={`flex justify-between text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  <span>📍 {selectedJob?.location}</span>
                  <span>💰 ${selectedJob?.salary}/month</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Overview;
