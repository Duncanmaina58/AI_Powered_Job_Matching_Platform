import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Briefcase,
  Bot,
  Menu,
  X,
  Home,
  LayoutDashboard,
  UserPlus,
} from "lucide-react";
import logo from "../assets/logo.png";
import { getAuthToken } from "../utils/getAuthToken";
import axios from "axios";
const token = getAuthToken();
axios.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Detect user role on load and when storage updates
  useEffect(() => {
    const updateRole = () => {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const detectedRole =
            parsed?.role ||
            parsed?.user?.role ||
            parsed?.data?.role ||
            parsed?.userInfo?.role;
          setRole(detectedRole ? detectedRole.toLowerCase() : null);
        } catch (err) {
          console.error("Error reading user info:", err);
        }
      } else {
        setRole(null);
      }
    };

    updateRole();
    window.addEventListener("user-updated", updateRole);
    return () => window.removeEventListener("user-updated", updateRole);
  }, []);

  // 🧩 Hide Navbar on login/register pages
  const hideNavbarPaths = ["/login", "/register", "/LandingPage"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setRole(null);
    navigate("/login");
  };

  // ✅ Active tab detection
  const isActive = (path) => location.pathname === path;

  // ✅ Navigation sets per role
  const commonLinks = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
  ];

  const jobseekerLinks = [
    {
      path: "/jobseeker/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/ai",
      label: "AI Match",
      icon: <Bot size={18} />,
    },
    {
      path: "/BrowseJobs",
      label: "Browse Jobs",
      icon: <Briefcase size={18} />,
    },
  ];

  const employerLinks = [
    {
      path: "/employer/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/employer/post-job",
      label: "Post Job",
      icon: <Briefcase size={18} />,
    },
    {
      path: "/employer/my-jobs",
      label: "Manage Jobs",
      icon: <Briefcase size={18} />,
    },
  ];

  const guestLinks = [
    { path: "/login", label: "Login", icon: <UserPlus size={18} /> },
  ];

  // ✅ Dynamically select links by role
  const displayedLinks =
    role === "jobseeker"
      ? [...commonLinks, ...jobseekerLinks]
      : role === "employer"
      ? [...commonLinks, ...employerLinks]
      : [...commonLinks, ...guestLinks];

  return (
    <>
      {/* 🧭 Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#0a0a23] text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            <h1 className="text-2xl font-bold tracking-wide hover:text-blue-400 transition-colors">
              GlobalJobHub
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {displayedLinks.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-1 transition-colors ${
                  isActive(item.path)
                    ? "text-blue-400"
                    : "text-gray-200 hover:text-blue-400"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {role && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0a0a23] border-t border-gray-700 px-6 pb-4 space-y-3">
            {displayedLinks.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 flex items-center gap-2 ${
                  isActive(item.path)
                    ? "text-blue-400"
                    : "text-gray-200 hover:text-blue-400"
                } transition-colors`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {role && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Padding for fixed navbar */}
      <div className="pt-20"></div>
    </>
  );
}

export default Navbar;
