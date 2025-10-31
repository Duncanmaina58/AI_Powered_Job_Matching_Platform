import { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "" });
 
  const [preview, setPreview] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUserInfo(storedUser);
      setForm({ name: storedUser.name || "", email: storedUser.email || "" });
      setPreview(storedUser.avatar ? storedUser.avatar : null);
    }
  }, []);

 const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  setError("");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/users/profile`,
      { name: form.name, email: form.email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    setMessage("✅ Profile updated successfully!");
  } catch (err) {
    console.error("Profile Update Error:", err);
    setError("❌ Failed to update profile. Please re-login.");
  } finally {
    setLoading(false);
  }
};


const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setPreview(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/upload-avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessage("✅ Avatar uploaded!");
    const updatedUser = { ...userInfo, avatar: data.avatar };
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setUserInfo(updatedUser);
  } catch (err) {
    console.error("Avatar Upload Error:", err);
    setError("❌ Failed to upload avatar.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Account Settings</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {["profile", "password"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "profile" ? "Profile Information" : "Change Password"}
            </button>
          ))}
        </div>

        {message && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 text-center rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 text-center rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={preview || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-md"
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow hover:bg-blue-700"
                >
                  <i className="fa fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
