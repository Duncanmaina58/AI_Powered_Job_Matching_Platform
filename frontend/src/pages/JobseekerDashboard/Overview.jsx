import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Search, MapPin, Clock } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Overview = () => {
  const [stats, setStats] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Modal open handler
  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="w-full bg-[#f9fbff] min-h-screen">
      {/* Welcome + Stats */}
      <motion.div
        className="px-6 lg:px-20 pt-10 pb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-blue-400 shadow-md"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name || "Jobseeker"} 👋
            </h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow text-center border border-gray-100 hover:shadow-lg transition"
            >
              <h3 className="text-gray-500 font-medium">{s.title}</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">{s.value ?? "--"}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hero / Search Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        <motion.div className="max-w-xl text-center lg:text-left">
          <p className="text-blue-600 font-medium">We Have 200,000+ Live Jobs</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mt-2 leading-snug">
            Your <span className="text-blue-600">Dream Job</span> Is Waiting For You
          </h1>

          <div className="mt-6 bg-white shadow-md rounded-full flex items-center px-4 py-2 w-full max-w-lg mx-auto lg:mx-0">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Job title, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 border-none focus:ring-0 text-gray-700 outline-none"
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
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="Job seeker"
            className="w-80 lg:w-[420px]"
          />
        </motion.div>
      </section>

      {/* Jobs Grid */}
      <div className="px-6 lg:px-20 py-12">
        {loading ? (
          <div className="text-center text-gray-500">
            <Loader2 className="animate-spin inline-block mr-2" />
            Loading jobs...
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => openModal(job)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <img
                    src={job.logo || "https://cdn-icons-png.flaticon.com/512/5968/5968292.png"}
                    alt={job.title}
                    className="w-12 h-12 rounded"
                  />
                  <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded">
                    {job.jobType}
                  </span>
                </div>
                <h3 className="mt-4 font-bold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="flex items-center text-gray-600 text-sm mt-2">
                  <MapPin size={14} className="mr-1" /> {job.location}
                </p>
                <p className="flex items-center text-gray-600 text-sm">
                  <Clock size={14} className="mr-1" /> {job.postedAt || "1 day ago"}
                </p>
                <p className="text-blue-700 font-bold mt-3">${job.salary}/month</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No jobs found. Try another search.</p>
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl">
                <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">
                  {selectedJob?.title}
                </Dialog.Title>
                <p className="text-gray-500 mb-4">{selectedJob?.company}</p>
                <p className="text-gray-600 mb-3">{selectedJob?.description}</p>
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
};

export default Overview;
