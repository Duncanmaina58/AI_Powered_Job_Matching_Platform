// client/src/components/AboutUsSection.jsx
import { motion } from "framer-motion";
import { Briefcase, Users, Target } from "lucide-react";

export default function AboutUsSection() {
  return (
    <section className="py-20 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          About <span className="text-blue-600">JobHub</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
        >
          JobHub is a next-generation recruitment platform designed to connect job
          seekers and employers seamlessly. We’re driven by <strong>SDG 8: Decent Work
          and Economic Growth</strong> — empowering people to find meaningful jobs and
          helping businesses build high-performing teams efficiently.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white shadow-md rounded-2xl p-8 text-center hover:shadow-lg transition"
          >
            <Briefcase className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Empowering Job Seekers
            </h3>
            <p className="text-gray-600">
              We help individuals discover opportunities that align with their
              skills, passions, and goals — ensuring meaningful career growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-md rounded-2xl p-8 text-center hover:shadow-lg transition"
          >
            <Users className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Supporting Employers
            </h3>
            <p className="text-gray-600">
              Our platform streamlines hiring — helping businesses find top talent
              faster, smarter, and with AI-powered matching tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white shadow-md rounded-2xl p-8 text-center hover:shadow-lg transition"
          >
            <Target className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-600">
              To become Africa’s leading platform for decent employment — bridging
              the gap between opportunity and talent, one connection at a time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
