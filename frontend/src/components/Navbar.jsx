import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Briefcase, Bot, Menu, X, Home, LayoutDashboard } from "lucide-react";
import logo from "../assets/logo.png"; // ✅ Place your logo in src/assets/logo.png

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Detect active tab
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* 🧭 Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#0a0a23] text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            <h1 className="text-2xl font-bold tracking-wide hover:text-blue-400 transition-colors">
              GlobalJobHub
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/jobseeker/dashboard"
              className={`flex items-center gap-1 transition-colors ${
                isActive("/") ? "text-blue-400" : "text-gray-200 hover:text-blue-400"
              }`}
            >
              <Home size={18} />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/jobseeker/dashboard"
              className={`flex items-center gap-1 transition-colors ${
                isActive("/dashboard")
                  ? "text-blue-400"
                  : "text-gray-200 hover:text-blue-400"
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/BrowseJobs"
              className={`flex items-center gap-1 transition-colors ${
                isActive("/BrowseJobs")
                  ? "text-blue-400"
                  : "text-gray-200 hover:text-blue-400"
              }`}
            >
              <Briefcase size={18} />
              <span className="font-medium">Jobs</span>
            </Link>

            <Link
              to="/ai"
              className={`flex items-center gap-1 transition-colors ${
                isActive("/ai") ? "text-blue-400" : "text-gray-200 hover:text-blue-400"
              }`}
            >
              <Bot size={18} />
              <span className="font-medium">AI Match</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#0a0a23] border-t border-gray-700 px-6 pb-4 space-y-3">
            {[
              { path: "/", label: "Home", icon: <Home size={18} /> },
              { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
              { path: "/BrowseJobs", label: "Jobs", icon: <Briefcase size={18} /> },
              { path: "/ai", label: "AI Match", icon: <Bot size={18} /> },
            ].map((item, i) => (
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
          </div>
        )}
      </nav>

      {/* 🧩 Page Content Padding Fix */}
      <div className="pt-20"></div>
    </>
  );
}

export default Navbar;
