import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Briefcase,
    MapPin,
    DollarSign,
    Search,
    Loader2,
    Clock,
    Heart,
    Monitor,
    Pencil,
    ShoppingBag
} from "lucide-react";
// import Navbar from "../LandingPage/Navbar"; // reuse your landing page navbar

export default function BrowseJobs({ darkMode }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const navigate = useNavigate();

    const darkClasses = {
        bg: darkMode ? "bg-gray-900" : "bg-gray-50",
        text: darkMode ? "text-gray-100" : "text-gray-800",
        cardBg: darkMode ? "bg-gray-800/70 backdrop-blur-md" : "bg-white/70 backdrop-blur-md",
        cardBorder: darkMode ? "border-gray-700" : "border-gray-200",
        subText: darkMode ? "text-gray-400" : "text-gray-500",
        inputBg: darkMode ? "bg-gray-800" : "bg-white",
        inputText: darkMode ? "text-gray-200" : "text-gray-700",
    };

    const categories = [
        { name: "All", icon: Briefcase },
        { name: "Tech", icon: Monitor },
        { name: "Marketing", icon: Pencil },
        { name: "Design", icon: Briefcase },
        { name: "Sales", icon: ShoppingBag },
    ];

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
            setJobs(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch jobs:", err);
            setError("❌ Failed to load jobs. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs
        .filter(
            (job) =>
                job.title?.toLowerCase().includes(search.toLowerCase()) ||
                job.company?.toLowerCase().includes(search.toLowerCase()) ||
                job.location?.toLowerCase().includes(search.toLowerCase())
        )
        .filter(
            (job) => selectedCategory === "All" || job.category === selectedCategory
        );

    return (
        <div className={`${darkClasses.bg} transition-colors duration-300 min-h-screen`}>
            {/* <Navbar darkMode={darkMode} /> */}

            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center py-20 px-6 bg-gradient-to-br from-indigo-600 to-blue-400 text-white relative overflow-hidden"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    Find Your Dream Job
                </h1>
                <p className="text-lg md:text-xl drop-shadow-md">
                    Explore thousands of opportunities with top companies
                </p>
                <Briefcase className="absolute top-10 left-10 animate-bounce text-white/50 w-8 h-8" />
                <Search className="absolute bottom-10 right-10 animate-pulse text-white/50 w-8 h-8" />
            </motion.div>

            {/* Sticky Container for Search & Category Bar */}
            <div 
                className={`sticky top-0 z-50 pt-4 pb-4 ${darkClasses.bg} shadow-lg`} // Added sticky, top-0, z-50, padding, and background
            >
                {/* Search & Category Bar (The original motion.div content) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    // Removed -mt-12
                    className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-4"
                >
                    {/* Glassy Search Bar */}
                    <div
                        className={`flex items-center gap-2 ${darkClasses.inputBg} shadow-lg px-4 py-3 rounded-xl flex-1 border ${darkClasses.cardBorder}`}
                    >
                        <Search className="text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search jobs, companies, or locations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`flex-1 outline-none bg-transparent text-sm ${darkClasses.inputText}`}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-3 overflow-x-auto py-2">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.name;
                            return (
                                <motion.button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                                        isSelected
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : `${darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-200"}`
                                    } transition-all flex-shrink-0`}
                                >
                                    <Icon size={16} />
                                    <span className="text-sm font-medium">{cat.name}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>


            {/* Job Listings */}
            <div className="max-w-7xl mx-auto px-6 mt-4"> {/* Adjusted top margin */}
                {loading ? (
                    <div className="flex justify-center items-center py-10 text-gray-400">
                        <Loader2 className="animate-spin mr-2" /> Loading jobs...
                    </div>
                ) : error ? (
                    <p className="text-center text-red-600">{error}</p>
                ) : filteredJobs.length === 0 ? (
                    <p className={`text-center ${darkClasses.subText}`}>No jobs found.</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job, i) => (
                            <motion.div
                                key={job._id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`${darkClasses.cardBg} border ${darkClasses.cardBorder} rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 relative`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} p-2 rounded-lg`}>
                                            <img
                                                src={job.logo || `https://ui-avatars.com/api/?name=${job.company}&background=random`}
                                                alt={job.company}
                                                className="w-12 h-12 rounded-md object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-lg ${darkClasses.text}`}>{job.title}</h3>
                                            <p className={darkClasses.subText}>{job.company}</p>
                                        </div>
                                    </div>
                                    <Heart className="text-red-400 cursor-pointer hover:scale-110 transition-transform" />
                                </div>

                                <div className={`mt-4 ${darkClasses.subText} space-y-2 text-sm`}>
                                    <p className="flex items-center gap-2">
                                        <MapPin size={14} className={darkMode ? "text-blue-400" : "text-blue-500"} /> {job.location || "Not specified"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <DollarSign size={14} className={darkMode ? "text-green-400" : "text-green-500"} /> {job.salary_range?.min ? `$${job.salary_range.min.toLocaleString()}/month` : "$3500/month"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock size={14} className="text-gray-400" /> 1 Day Ago
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate(`/apply-job/${job._id}`)}
                                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium text-sm transition-transform duration-300 hover:scale-105"
                                >
                                    Apply Now
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}