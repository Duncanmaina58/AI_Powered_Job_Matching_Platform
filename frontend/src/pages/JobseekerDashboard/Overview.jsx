import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Target,
  MessageSquare,
  BarChart3,
  Search,
  MapPin,
  Clock,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

export default function Overview({ darkMode }) {
  const [stats, setStats] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDark = darkMode;

  // Fetch user & stats
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;
        if (!token) return setError("Please log in to view dashboard.");

        const [profileRes, statsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/jobseeker/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/jobseeker/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(profileRes.data);
        const s = statsRes.data;
        setStats([
          { title: "Active Applications", value: s.activeApplications, icon: <Briefcase /> },
          { title: "Jobs Matched", value: s.matchedJobs, icon: <Target /> },
          { title: "Messages", value: s.messages, icon: <MessageSquare /> },
          { title: "Profile Completion", value: `${s.profileCompletion}`, icon: <BarChart3 /> },
        ]);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* HERO SECTION */}
      <section className="relative py-16 px-6 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-b-[60px] shadow-xl"></div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center text-white"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                : "/logo.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-2xl object-cover"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />

          <h1 className="text-4xl font-extrabold mt-6">
            Welcome back, {user?.name || "Jobseeker"} 👋
          </h1>
          <p className="text-blue-100 mt-2">{user?.email}</p>
          
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative -mt-10 z-20 px-6 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className={`rounded-2xl p-6 shadow-lg text-center border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <motion.div
                className="flex justify-center mb-3 text-blue-600 dark:text-blue-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {stat.icon}
              </motion.div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</h3>
              <motion.p
                className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {stat.value ?? "--"}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEARCH BAR */}
      <section
        className={`py-16 px-6 lg:px-20 flex flex-col items-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          className="w-full max-w-2xl shadow-md rounded-full flex items-center px-4 py-3 bg-white dark:bg-gray-800"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Search className="text-gray-400 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent px-3 text-gray-700 dark:text-gray-200 outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition"
          >
            Find Jobs
          </button>
        </motion.div>
      </section>

      {/* JOBS GRID */}
      <div className="px-6 lg:px-20 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : jobs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
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
                    src={
                      job.logo ||
                      "https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
                    }
                    alt={job.title}
                    className="w-12 h-12 rounded"
                  />
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold px-2 py-1 rounded">
                    {job.jobType}
                  </span>
                </div>
                <h3 className="mt-4 font-bold">{job.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {job.company}
                </p>
                <p className="flex items-center text-sm mt-2">
                  <MapPin size={14} className="mr-1" /> {job.location}
                </p>
                <p className="flex items-center text-sm">
                  <Clock size={14} className="mr-1" /> {job.postedAt || "Recently posted"}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-bold mt-3">
                  ${job.salary}/month
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}
      </div>

      {/* JOB DETAIL MODAL */}
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
                className={`w-full max-w-lg p-6 rounded-2xl shadow-xl ${
                  isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
              >
                <Dialog.Title className="text-xl font-bold mb-2">
                  {selectedJob?.title}
                </Dialog.Title>
                <p className="text-gray-500 mb-4">{selectedJob?.company}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {selectedJob?.description}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
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
}
