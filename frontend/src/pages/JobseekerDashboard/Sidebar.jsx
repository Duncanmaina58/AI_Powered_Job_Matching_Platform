// frontend/src/pages/JobseekerDashboard/Sidebar.jsx
import { Home, Briefcase, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: <Home size={18} /> },
    { id: "browse", label: "Browse Jobs", icon: <Briefcase size={18} /> },
    { id: "applications", label: "My Applications", icon: <Briefcase size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
  ];
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-blue-700 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">JobSeeker</h1>

      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              active === item.id ? "bg-blue-900" : "hover:bg-blue-800"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
