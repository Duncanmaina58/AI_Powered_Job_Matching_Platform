import { motion } from "framer-motion";
import { Briefcase, Code, Palette, Settings, Megaphone, DollarSign, HeartPulse, GraduationCap } from "lucide-react";

const categories = [
  { icon: <Code size={30} />, title: "Software Development", jobs: "3.2K+ Jobs", color: "from-indigo-500 to-purple-500" },
  { icon: <Palette size={30} />, title: "Design & Creative", jobs: "1.8K+ Jobs", color: "from-pink-500 to-orange-400" },
  { icon: <Megaphone size={30} />, title: "Marketing", jobs: "2.1K+ Jobs", color: "from-green-400 to-teal-500" },
  { icon: <Settings size={30} />, title: "Engineering", jobs: "980+ Jobs", color: "from-yellow-400 to-orange-500" },
  { icon: <DollarSign size={30} />, title: "Finance", jobs: "1.2K+ Jobs", color: "from-blue-400 to-cyan-400" },
  { icon: <HeartPulse size={30} />, title: "Healthcare", jobs: "2.4K+ Jobs", color: "from-rose-500 to-pink-400" },
  { icon: <Briefcase size={30} />, title: "Business & Management", jobs: "1.9K+ Jobs", color: "from-purple-500 to-indigo-500" },
  { icon: <GraduationCap size={30} />, title: "Education & Training", jobs: "1.1K+ Jobs", color: "from-teal-400 to-blue-500" },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800"
        >
          Explore Popular <span className="text-indigo-600">Job Categories</span>
        </motion.h2>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-500 mt-3 max-w-2xl mx-auto"
        >
          Discover roles tailored to your expertise. Whether you’re a developer, designer, or manager,
          we’ve got opportunities waiting for you.
        </motion.p>

        {/* Categories Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl shadow-md bg-gradient-to-br ${cat.color} text-white flex flex-col items-center justify-center space-y-3 cursor-pointer transform transition-all duration-300`}
            >
              <div className="bg-white/20 p-3 rounded-full">{cat.icon}</div>
              <h3 className="text-lg font-semibold">{cat.title}</h3>
              <p className="text-sm text-white/80">{cat.jobs}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
