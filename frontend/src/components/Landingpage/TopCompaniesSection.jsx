import { motion } from "framer-motion";

const companies = [
  { name: "Google", logo: "https://cdn.worldvectorlogo.com/logos/google-2015.svg" },
  { name: "Microsoft", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-6.svg" },
  { name: "Amazon", logo: "https://cdn.worldvectorlogo.com/logos/amazon-icon-1.svg" },
  { name: "Netflix", logo: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg" },
  { name: "Meta", logo: "https://cdn.worldvectorlogo.com/logos/meta-2.svg" },
  { name: "Airbnb", logo: "https://cdn.worldvectorlogo.com/logos/airbnb-2.svg" },
  { name: "Spotify", logo: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg" },
  { name: "Adobe", logo: "https://cdn.worldvectorlogo.com/logos/adobe-3.svg" },
];

export default function TopCompaniesSection() {
  return (
    <section className="py-20 bg-gray-50" id="Trustedby">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800"
        >
          Trusted by <span className="text-indigo-600">Leading Companies</span>
        </motion.h2>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-500 mt-3 max-w-2xl mx-auto"
        >
          We partner with innovative employers across industries to bring the best job opportunities to you.
        </motion.p>

        {/* Logos Grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 items-center justify-center">
          {companies.map((company, i) => (
            <motion.div
              key={i}
              className="flex justify-center items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="max-h-16 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
