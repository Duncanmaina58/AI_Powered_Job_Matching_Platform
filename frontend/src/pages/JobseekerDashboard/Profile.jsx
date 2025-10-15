import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { User, FileText, Upload, Save, Loader2, Edit, XCircle, CheckCircle, Info, MessageSquare } from "lucide-react";

// Utility Component: Message Bar
const MessageBar = ({ message, onClose }) => {
    if (!message) return null;

    const { type, text } = message;
    const isSuccess = type === 'success';

    return (
        <div 
            className={`p-4 rounded-lg flex items-center justify-between transition-opacity duration-300 mb-6 ${
                isSuccess 
                    ? 'bg-green-100 text-green-800 border-green-300' 
                    : 'bg-red-100 text-red-800 border-red-300'
            } border shadow-md`}
            role="alert"
        >
            <div className="flex items-center gap-3">
                {isSuccess ? <CheckCircle size={20} className="flex-shrink-0" /> : <XCircle size={20} className="flex-shrink-0" />}
                <span className="font-medium text-sm">{text}</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <XCircle size={20} />
            </button>
        </div>
    );
};


const Profile = () => {
    const [user, setUser] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    // New state for message display
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
        skills: "",
    });

    // Function to clear the temporary message
    const clearMessage = () => setMessage(null);
    
    // ✅ Fetch user profile
    const fetchProfile = useCallback(async () => {
        setLoading(true);
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
            // Setting an error message for the user
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

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
        setMessage({ type: 'info', text: file ? `New resume selected: ${file.name}` : 'Resume cleared.' });
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
        clearMessage();

        try {
            await axios.put("http://localhost:5000/api/jobseeker/profile", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setEditMode(false);
            // Re-fetch profile to update user state after save
            await fetchProfile(); 
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: "Failed to update profile. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel to revert changes
    const handleCancelEdit = () => {
        setEditMode(false);
        setResumeFile(null); // Clear pending resume file
        // Reset formData to the current user state
        setFormData({
            name: user.name || "",
            email: user.email || "",
            bio: user.bio || "",
            skills: user.skills?.join(", ") || "",
        });
        setProfileImagePreview(user.profileImage ? `http://localhost:5000${user.profileImage}` : null);
        clearMessage();
    };

    if (!user || loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px] h-screen bg-gray-50 text-gray-600">
                <Loader2 className="animate-spin mr-3 text-blue-500" size={24} /> 
                <span className="font-semibold">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Your Professional Profile</h1>
                
                <MessageBar message={message} onClose={clearMessage} />

                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
                    
                    {/* Profile Header (Instagram Layout) */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-8 mb-8">
                        
                        {/* Profile Picture & Upload */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={
                                    profileImagePreview ||
                                    "https://placehold.co/120x120/a8a29e/ffffff?text=User"
                                }
                                alt="Profile Avatar"
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 ring-4 ring-blue-100 shadow-xl transition duration-300"
                            />
                            {editMode && (
                                <label 
                                    htmlFor="profile-image-upload"
                                    className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer text-white border-2 border-white shadow-lg hover:bg-blue-700 transition"
                                    title="Change Profile Picture"
                                >
                                    <Upload size={20} />
                                    <input
                                        id="profile-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfileImageChange}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-grow text-center md:text-left pt-2">
                            <div className="flex flex-col md:flex-row items-center md:justify-between mb-2 gap-4">
                                <h2 className="text-3xl font-extrabold text-gray-900 leading-none">
                                    {editMode ? (
                                        <input 
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="text-3xl font-extrabold border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 transition w-full"
                                        />
                                    ) : (
                                        formData.name || "Set Your Name"
                                    )}
                                </h2>
                                {/* Action Button: Edit / Save */}
                                <button
                                    onClick={editMode ? handleSave : () => setEditMode(true)}
                                    disabled={loading}
                                    className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md flex items-center gap-2 ${
                                        editMode 
                                            ? 'bg-green-600 text-white hover:bg-green-700' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {loading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : editMode ? (
                                        <Save size={16} />
                                    ) : (
                                        <Edit size={16} />
                                    )}
                                    {loading ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
                                </button>
                            </div>
                            
                            <p className="text-xl text-gray-600 font-light mb-4">{formData.email}</p>
                            
                            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg inline-flex">
                                <User size={16} className="text-blue-500" />
                                <span className="font-medium">Role:</span> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="space-y-8">
                        
                        {/* Bio Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                                <MessageSquare size={20} className="text-blue-500" /> Professional Bio
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <textarea
                                    name="bio"
                                    rows="4"
                                    disabled={!editMode}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Write a brief, professional summary about yourself, your goals, and your experience."
                                    className={`w-full p-0 border-none resize-none focus:ring-0 ${
                                        editMode ? "bg-white text-gray-800" : "bg-transparent text-gray-600"
                                    }`}
                                />
                                {!editMode && !formData.bio && (
                                    <p className="text-gray-400 italic">No bio provided. Click "Edit Profile" to add one.</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Skills Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                                <Info size={20} className="text-blue-500" /> Core Skills
                            </h3>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Separate skills with commas, e.g., JavaScript, React, SQL"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.split(',').filter(s => s.trim()).map((skill, index) => (
                                        <span key={index} className="px-4 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                    {(!formData.skills || formData.skills.trim() === '') && (
                                        <p className="text-gray-400 italic">No skills listed.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Resume Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                                <FileText size={20} className="text-blue-500" /> Resume / CV
                            </h3>
                            
                            {/* Current Resume Display */}
                            {user.resume && (
                                <a
                                    href={`http://localhost:5000${user.resume}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 flex items-center gap-2 font-medium hover:text-blue-800 transition mb-3"
                                >
                                    <FileText size={20} /> Current Resume Uploaded
                                </a>
                            )}

                            {/* Resume Upload Control */}
                            {editMode && (
                                <div className="mt-2 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                    <label className="flex items-center gap-3 text-blue-600 cursor-pointer font-medium hover:text-blue-700 transition">
                                        <Upload size={20} />
                                        <span>{resumeFile ? `New file ready: ${resumeFile.name}` : 'Click to upload or replace your Resume (PDF)'}</span>
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

                    {/* Secondary Action: Cancel Button */}
                    {editMode && (
                        <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition shadow-sm"
                            >
                                Cancel Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
