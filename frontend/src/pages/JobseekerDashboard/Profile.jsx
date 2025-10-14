// frontend/src/pages/JobseekerDashboard/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, FileText, Upload, Save, Loader } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
  });

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/jobseeker/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          skills: data.skills?.join(", ") || "",
        });
        setProfileImagePreview(data.profileImage ? `http://localhost:5000${data.profileImage}` : null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle file selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImagePreview(URL.createObjectURL(file));
    setFormData({ ...formData, profileImage: file });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
  };

  // ✅ Save changes
  const handleSave = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("bio", formData.bio);
    form.append("skills", formData.skills);
    if (formData.profileImage) form.append("profileImage", formData.profileImage);
    if (resumeFile) form.append("resume", resumeFile);

    setLoading(true);
    try {
      await axios.put("http://localhost:5000/api/jobseeker/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <img
            src={
              profileImagePreview ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow"
          />
          {editMode && (
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer text-white">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </label>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{formData.name}</h2>
          <p className="text-gray-500">{formData.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Bio</label>
          <textarea
            name="bio"
            rows="3"
            disabled={!editMode}
            value={formData.bio}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              editMode ? "border-blue-400 focus:ring focus:ring-blue-200" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Skills</label>
          <input
            type="text"
            name="skills"
            disabled={!editMode}
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, SQL"
            className={`w-full p-3 border rounded-lg ${
              editMode ? "border-blue-400 focus:ring focus:ring-blue-200" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Resume</label>
          {user.resume ? (
            <a
              href={`http://localhost:5000${user.resume}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 flex items-center gap-2 hover:underline"
            >
              <FileText size={18} /> View Resume
            </a>
          ) : (
            <p className="text-gray-500 italic">No resume uploaded</p>
          )}

          {editMode && (
            <div className="mt-2">
              <label className="flex items-center gap-2 text-blue-600 cursor-pointer">
                <Upload size={18} />
                <span>Upload New Resume (PDF)</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleResumeChange}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-6 gap-4">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
