import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { User, FileText, Upload, Save, Loader2, Edit, XCircle, CheckCircle, Info, MessageSquare, X } from "lucide-react";

// Utility Component: Message Bar (Modified for Dark Mode)
const MessageBar = ({ message, onClose, darkMode }) => {
    if (!message) return null;

    const { type, text } = message;
    const isSuccess = type === 'success';

    const baseClasses = "p-4 rounded-lg flex items-center justify-between transition-opacity duration-300 mb-6 border shadow-md";

    // Dark mode classes for success/error
    const colorClasses = isSuccess 
        ? (darkMode 
            ? 'bg-green-900 text-green-300 border-green-700' 
            : 'bg-green-100 text-green-800 border-green-300')
        : (darkMode 
            ? 'bg-red-900 text-red-300 border-red-700' 
            : 'bg-red-100 text-red-800 border-red-300');

    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
    const closeButtonClasses = darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700';

    return (
        <div 
            className={`${baseClasses} ${colorClasses}`}
            role="alert"
        >
            <div className="flex items-center gap-3">
                {isSuccess 
                    ? <CheckCircle size={20} className={`flex-shrink-0 ${iconColor}`} /> 
                    : <XCircle size={20} className={`flex-shrink-0 ${iconColor}`} />}
                <span className="font-medium text-sm">{text}</span>
            </div>
            <button onClick={onClose} className={closeButtonClasses}>
                <X size={20} />
            </button>
        </div>
    );
};


const Profile = ({ darkMode }) => {
    const [user, setUser] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
        skills: "",
    });

    // Dark Mode Class Definitions
    const bgClass = darkMode ? "bg-gray-800" : "bg-gray-50";
    const contentBgClass = darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-100 text-gray-900";
    const h1Class = darkMode ? "text-gray-100 border-gray-600" : "text-gray-900 border-gray-200";
    const borderClass = darkMode ? "border-gray-600" : "border-gray-200";
    const textLightClass = darkMode ? "text-gray-400" : "text-gray-600";
    const placeholderClass = darkMode ? "placeholder-gray-500" : "placeholder-gray-400";

  const inputClasses = (isTextArea = false) => {
        const base = `w-full p-0 border-none resize-none focus:ring-0 ${placeholderClass} transition duration-200`;
        if (!editMode) {
            return isTextArea 
                ? `${base} bg-transparent ${textLightClass}`
                : `${base} bg-transparent text-lg font-extrabold`;
        }
        // Edit mode styles
        return isTextArea
            ? `${base} ${darkMode ? "bg-gray-600 text-gray-100 border-gray-500 rounded-lg p-2" : "bg-white text-gray-800"}`
            : `${base} ${darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"}`; // Added a second branch for input field in edit mode
    };

    const displayBlockBgClass = darkMode ? "bg-gray-600 border-gray-500" : "bg-gray-50 border-gray-200";
    const skillBadgeClasses = darkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800";
    const resumeLinkClasses = darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800";
    const resumeUploadClasses = darkMode 
        ? "bg-yellow-900 p-4 rounded-xl border border-yellow-800 text-yellow-300"
        : "bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-gray-700";
    const linkHoverClasses = darkMode ? "hover:text-blue-300" : "hover:text-blue-700";
    const cancelButtonClasses = darkMode 
        ? "bg-gray-600 text-gray-200 hover:bg-gray-500" 
        : "bg-gray-200 text-gray-700 hover:bg-gray-300";


    // Function to clear the temporary message
    const clearMessage = () => setMessage(null);
    
    // ✅ Fetch user profile (This block was the source of the syntax error)
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobseeker/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(data);
            setFormData({
                name: data.name || "",
                email: data.email || "",
                bio: data.bio || "",
                skills: data.skills?.join(", ") || "",
            });
            // Ensure proper API_URL concatenation for image preview
            setProfileImagePreview(data.profileImage ? `${import.meta.env.VITE_API_URL}${data.profileImage}` : null);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    }, [token]); // <-- Line 79 is likely here, now clean.

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
        setMessage({ type: 'info', text: file ? `New resume selected: ${file.name}. Click 'Save Changes' to upload.` : 'Resume cleared.' });
    };

    // ✅ Save changes
    const handleSave = async () => {
        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        form.append("bio", formData.bio);
        form.append("skills", formData.skills);
        // Only append if it's a new file object, not the URL string
        if (formData.profileImage instanceof File) form.append("profileImage", formData.profileImage);
        if (resumeFile) form.append("resume", resumeFile);

        setLoading(true);
        clearMessage();

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/jobseeker/profile`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setEditMode(false);
            setResumeFile(null);
            // Re-fetch profile to update user state after save
            await fetchProfile(); 
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: `Failed to update profile. ${error.response?.data?.message || 'Please try again.'}` });
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
        // Reset image preview to the last saved image
        setProfileImagePreview(user.profileImage ? `${import.meta.env.VITE_API_URL}${user.profileImage}` : null);
        clearMessage();
    };

    if (!user || loading) {
        return (
            <div className={`flex justify-center items-center min-h-[400px] h-screen ${bgClass} ${textLightClass}`}>
                <Loader2 className="animate-spin mr-3 text-blue-500" size={24} /> 
                <span className="font-semibold">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgClass} py-10 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-4xl mx-auto">
                <h1 className={`text-3xl font-bold ${h1Class} mb-6 border-b pb-2`}>Your Professional Profile</h1>
                
                <MessageBar message={message} onClose={clearMessage} darkMode={darkMode} />

                <div className={`${contentBgClass} rounded-3xl shadow-2xl p-6 md:p-10 border`}>
                    
                    {/* Profile Header (Instagram Layout) */}
                    <div className={`flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-8 mb-8 ${borderClass}`}>
                        
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
                                <h2 className={`text-3xl font-extrabold ${darkMode ? "text-gray-100" : "text-gray-900"} leading-none`}>
                                    {editMode ? (
                                        <input 
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`text-3xl font-extrabold border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 transition w-full ${darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"}`}
                                        />
                                    ) : (
                                        formData.name || "Set Your Name"
                                    )}
                                </h2>
                                {/* Action Button: Edit / Save */}
                                <div className="flex gap-2">
                                    {editMode && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md flex items-center gap-2 ${cancelButtonClasses}`}
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={editMode ? handleSave : () => setEditMode(true)}
                                        disabled={loading}
                                        className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md flex items-center gap-2 ${
                                            editMode 
                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        } disabled:opacity-50`}
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
                            </div>
                            
                            <p className={`text-xl ${textLightClass} font-light mb-4`}>{formData.email}</p>
                            
                            <div className={`flex items-center gap-3 text-sm ${textLightClass} ${displayBlockBgClass} p-2 rounded-lg inline-flex`}>
                                <User size={16} className="text-blue-500" />
                                <span className="font-medium">Role:</span> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="space-y-8">
                        
                        {/* Bio Section */}
                        <div>
                            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} flex items-center gap-2 mb-2`}>
                                <MessageSquare size={20} className="text-blue-500" /> Professional Bio
                            </h3>
                            <div className={`${displayBlockBgClass} p-4 rounded-xl border`}>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    disabled={!editMode}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Write a brief, professional summary about yourself, your goals, and your experience."
                                    className={`${inputClasses(true)} ${editMode ? "p-2" : ""}`}
                                />
                                {!editMode && !formData.bio && (
                                    <p className="text-gray-400 italic">No bio provided. Click "Edit Profile" to add one.</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Skills Section */}
                        <div>
                            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} flex items-center gap-2 mb-2`}>
                                <Info size={20} className="text-blue-500" /> Core Skills
                            </h3>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Separate skills with commas, e.g., JavaScript, React, SQL"
                                    className={`w-full p-4 border rounded-xl focus:border-blue-500 focus:ring-blue-500 transition ${darkMode ? "bg-gray-600 border-gray-500 text-gray-100" : "bg-white border-gray-300 text-gray-800"}`}
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.split(',').filter(s => s.trim()).map((skill, index) => (
                                        <span key={index} className={`px-4 py-1 text-sm font-medium rounded-full ${skillBadgeClasses}`}>
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
                            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} flex items-center gap-2 mb-2`}>
                                <FileText size={20} className="text-blue-500" /> Resume / CV
                            </h3>
                            
                            {/* Current Resume Display */}
                            {user.resume && (
                                <a
                                    href={`${import.meta.env.VITE_API_URL}${user.resume}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${resumeLinkClasses} flex items-center gap-2 font-medium transition mb-3`}
                                >
                                    <FileText size={20} /> Current Resume Uploaded
                                </a>
                            )}

                            {/* Resume Upload Control */}
                            {editMode && (
                                <div className={`mt-2 ${resumeUploadClasses}`}>
                                    <label className={`flex items-center gap-3 cursor-pointer font-medium ${linkHoverClasses}`}>
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
                </div>
            </div>
        </div>
    );
};

export default Profile;