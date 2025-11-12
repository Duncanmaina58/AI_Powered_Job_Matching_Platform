import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CallToActionSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 py-20 text-white overflow-hidden">
      {/* Animated Background Circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.2),_transparent_70%)]"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Ready to <span className="text-yellow-300">Find Your Dream Job?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg mb-8 text-indigo-100"
        >
          Join thousands of job seekers and employers already using{" "}
          <span className="font-semibold text-white">GlobalJobHub</span> to
          connect, grow, and succeed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/BrowseJobs")}
            className="border border-white hover:bg-white hover:text-indigo-700 font-semibold px-8 py-3 rounded-full transition-all"
          >
            Browse Jobs
          </button>
        </motion.div>
      </div>
    </section>
  );
}
