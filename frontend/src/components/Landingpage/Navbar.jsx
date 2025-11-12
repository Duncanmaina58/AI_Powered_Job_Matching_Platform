import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Jobs", href: "#jobs" },
    { name: "Companies", href: "#Trustedby" },
    { name: "How It Works", href: "#how" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled
          ? "bg-white shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-700">
          GlobalJob<span className="text-orange-500">Hub</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="hover:text-indigo-600 transition-colors duration-300"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button onClick={() => navigate("/register")}
        className="hidden md:block bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all duration-300">
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 mt-2">
          <ul className="flex flex-col space-y-4 text-center text-gray-700 font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-indigo-600 transition-colors duration-300"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all duration-300">
                Sign In
                <link rel="stylesheet" href="/Login" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </motion.nav>
  );
}
