import { motion } from "framer-motion";
import { Briefcase, Building2, Award } from "lucide-react";
import illustration from "../../assets/login-illustration.png"; // 🖼️ Add any modern illustration here

export default function HeroSection() {
  return (
    <section className="pt-28 md:pt-32 pb-16 bg-gradient-to-br from-white to-indigo-50 overflow-hidden" id="home">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Find your <span className="text-indigo-600">Dream Job</span> <br />
            and Build your <span className="text-orange-500">Career</span>
          </h1>
          <p className="text-gray-600 mt-5 max-w-md">
            JobHub connects top talent with the best opportunities across industries.
            Discover your dream role or hire top professionals with ease.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300">
              Explore Jobs
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full hover:bg-indigo-50 transition-all duration-300">
              Post a Job
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-8 text-gray-800">
            <div>
              <h3 className="text-3xl font-bold">12K+</h3>
              <p className="text-sm text-gray-500">Active Job Listings</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">2K+</h3>
              <p className="text-sm text-gray-500">Hiring Companies</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-sm text-gray-500">Career Categories</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex-1 relative"
        >
          <img
            src={illustration}
            alt="Job search illustration"
            className="w-full max-w-md mx-auto drop-shadow-xl"
          />

          {/* Floating shapes for style */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-8 right-10 w-8 h-8 bg-indigo-500 rounded-full blur-sm opacity-60"
          ></motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute bottom-10 left-6 w-10 h-10 bg-orange-400 rounded-full blur-md opacity-70"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
