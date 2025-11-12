// client/src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#0a0a23] text-gray-300 py-14">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* 1️⃣ Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <img src={logo} alt="JobHub Logo" className="w-12 h-12 rounded-lg" />
            <h2 className="text-2xl font-bold text-white">GlobalJobHub</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Empowering job seekers and employers through technology — 
            bridging global opportunities under SDG 8: Decent Work and Economic Growth.
          </p>
        </motion.div>

        {/* 2️⃣ Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { name: "Home", href: "/" },
              { name: "Browse Jobs", href: "/BrowseJobs" },
              { name: "AI Match", href: "/ai" },
              { name: "Contact", href: "/contact" },
            ].map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 3️⃣ Contact & Socials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Get in Touch</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@jobhub.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +254 742 140 658
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Nairobi, Kenya
            </li>
          </ul>

          <div className="flex gap-4 mt-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-gray-700 rounded-full hover:bg-blue-600 transition"
              >
                <Icon size={18} className="text-white" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} GlobalJobHub. All rights reserved.
      </div>
    </footer>
  );
}
