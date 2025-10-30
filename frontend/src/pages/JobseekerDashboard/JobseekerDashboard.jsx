// frontend/src/pages/JobseekerDashboard/JobseekerDashboard.jsx
import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import BrowseJobs from "./BrowseJobs";
import Applications from "./MyApplications";
import Profile from "./Profile";
import axios from "axios";
import { io } from "socket.io-client";
import { Bell, Menu, Moon, Sun } from "lucide-react";

function JobseekerDashboard() {
  const [active, setActive] = useState("overview");
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const bellRef = useRef(null);

  // ✅ Apply theme when toggled
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ✅ Fetch user info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("userInfo"));
        const token = stored?.token;
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUserData();
  }, []);

  // ✅ Setup Socket.io
useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("userInfo"));
  const token = stored?.token;
  if (!token) return;

  const newSocket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
  });

  setSocket(newSocket);

  newSocket.on("connect", () => {
    console.log("🟢 Socket connected:", newSocket.id);
    newSocket.emit("registerUser", { token });
  });

  newSocket.on("newNotification", (data) => {
    console.log("🔔 Notification received:", data);
    setNotifications((prev) => [data, ...prev]);
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});
  });

  newSocket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  return () => newSocket.disconnect();
}, []);

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("userInfo"));
        const token = stored?.token;
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notifications/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data.reverse());
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  // ✅ Notification dropdown
  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Render main section
  const renderContent = () => {
    switch (active) {
      case "overview":

        return <Overview darkMode={darkMode} />;
      case "browse":
        return <BrowseJobs darkMode={darkMode} />;
      case "applications":
        return <Applications darkMode={darkMode} />;
      case "profile":
        return <Profile darkMode={darkMode} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar active={active} setActive={setActive} darkMode={darkMode} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className={`w-64 p-4 text-white shadow-lg transition-all ${darkMode ? "bg-gray-800" : "bg-blue-700"}`}>
            <Sidebar
              active={active}
              setActive={(id) => {
                setActive(id);
                setSidebarOpen(false);
              }}
              darkMode={darkMode}
            />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header
          className={`sticky top-0 z-20 px-4 md:px-6 py-4 flex justify-between items-center shadow transition-colors ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              className="md:hidden hover:text-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold capitalize">
              {active}
            </h1>
          </div>

          <div className="flex items-center gap-6 relative" ref={bellRef}>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="transition hover:text-blue-500"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <Bell
                className="w-6 h-6 cursor-pointer hover:text-blue-500 transition"
                onClick={toggleNotifications}
              />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>

            {/* Username */}
            <div className="font-medium hidden sm:block">
              {user ? user.name : "Loading..."}
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className={`absolute top-10 right-0 rounded-lg w-72 max-h-80 overflow-y-auto border shadow-lg z-50 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              >
                {notifications.length === 0 ? (
                  <p className="text-center py-4 text-sm text-gray-400">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className={`p-3 border-b ${
                        darkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-100 hover:bg-gray-50"
                      } transition`}
                    >
                      <p className="font-semibold text-sm">{n.title}</p>
                      <p className="text-xs mt-1">{n.message}</p>
                      <p className="text-[11px] opacity-70 mt-1">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

export default JobseekerDashboard;
