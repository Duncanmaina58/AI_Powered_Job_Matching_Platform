import React, { useState } from "react";
import { Briefcase, Send, Tag, X, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Corrected import path
import { useNavigate } from "react-router-dom";


// 📦 Custom component for managing an array of skills (tags)
const SkillsInput = ({ requiredSkills, setRequiredSkills }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddSkill = (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && inputValue.trim() !== '') {
            e.preventDefault();
            const newSkill = inputValue.trim();
            if (!requiredSkills.includes(newSkill) && newSkill.length > 1) {
                setRequiredSkills([...requiredSkills, newSkill]);
            }
            setInputValue('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] items-center">
                {requiredSkills.map((skill, index) => (
                    <span 
                        key={index} 
                        className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition"
                        onClick={() => handleRemoveSkill(skill)}
                    >
                        {skill}
                        <X size={14} className="ml-1 opacity-70" />
                    </span>
                ))}
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring focus-within:ring-blue-200">
                <Tag size={20} className="ml-3 text-gray-400" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 px-3 py-2 focus:outline-none"
                    placeholder="Type skill and press Enter (e.g., Python, AWS, SQL)"
                />
                <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-100 text-blue-600 px-4 py-2 hover:bg-blue-200 transition font-medium text-sm"
                >
                    Add
                </button>
            </div>
        </div>
    );
}

export default function CreateJob() {
    // 1. ALL HOOKS MUST BE CALLED HERE (unconditionally at the top level)
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        experience_level: "Entry Level",
        description: "",
        salary_range_min: "",
        salary_range_max: "",
    });
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // 2. Conditional return AFTER all hooks have been called
    if (!user || user.role !== 'employer' || !user.token) {
        // Render a loading state or unauthorized message before redirect
        // In a real app, this should usually be handled by a secure route component
        navigate('/login');
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <AlertTriangle className="text-red-500 mr-2" /> 
                <p className="text-lg text-gray-700">Access Denied. Redirecting...</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title || !formData.location || !formData.description || requiredSkills.length === 0) {
            setMessage("⚠️ Please fill in Job Title, Location, Description, and add at least one required skill.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const jobData = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                experience_level: formData.experience_level,
                required_skills: requiredSkills, 
                salary_range: {
                    min: formData.salary_range_min ? parseFloat(formData.salary_range_min) : undefined,
                    max: formData.salary_range_max ? parseFloat(formData.salary_range_max) : undefined,
                },
            };

            const res = await axios.post("http://localhost:5000/api/jobs", jobData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (res.status === 201) {
                setMessage("✅ Job successfully posted! Redirecting to dashboard...");
                setFormData({
                    title: "", location: "", experience_level: "Entry Level", description: "", 
                    salary_range_min: "", salary_range_max: "",
                });
                setRequiredSkills([]);
                setTimeout(() => navigate("/employer/dashboard"), 1500);
            }
        } catch (error) {
            console.error("Error creating job:", error.response || error);
            const errorMsg = error.response?.data?.message || "Failed to post job due to a server error. Check if your user profile has a 'company_name'.";
            setMessage(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const companyName = user.company_name || 'Your Company'; 

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Briefcase className="text-blue-600" size={28} /> Post a Job for {companyName}
            </h2>
            <p className="text-gray-500 mb-8">
                Fill in the details below. Focus on the required skills for best AI matching results.
            </p>

            {message && (
                <div
                    className={`${
                        message.startsWith("✅")
                            ? "bg-green-100 border-green-400 text-green-700"
                            : message.startsWith("⚠️")
                            ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                            : "bg-red-100 border-red-400 text-red-700"
                    } border px-4 py-3 rounded-lg mb-6 shadow-sm`}
                >
                    {message}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-2xl rounded-xl p-8 space-y-6 border border-gray-100"
            >
                {/* Job Title & Experience Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <InputField 
                        label="Job Title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        placeholder="e.g. Senior Full Stack Developer"
                        required
                    />

                    {/* Experience Level (Matches Job.js enum) */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Experience Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="experience_level"
                            value={formData.experience_level}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring focus:ring-blue-200 transition"
                        >
                            <option value="Internship">Internship</option>
                            <option value="Entry Level">Entry Level</option>
                            <option value="Mid Level">Mid Level</option>
                            <option value="Senior Level">Senior Level</option>
                            <option value="Director">Director</option>
                        </select>
                    </div>
                </div>

                {/* Location & Salary Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Location */}
                    <InputField 
                        label="Location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="e.g. Remote or Nairobi"
                        required
                    />

                    {/* Salary Min */}
                    <InputField 
                        label="Minimum Salary (Ksh)" 
                        name="salary_range_min" 
                        type="number"
                        value={formData.salary_range_min} 
                        onChange={handleChange} 
                        placeholder="e.g. 50000"
                    />

                    {/* Salary Max */}
                    <InputField 
                        label="Maximum Salary (Ksh)" 
                        name="salary_range_max" 
                        type="number"
                        value={formData.salary_range_max} 
                        onChange={handleChange} 
                        placeholder="e.g. 150000"
                    />
                </div>
                
                {/* Skills Input (Array for AI) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Required Skills (For AI Matching) <span className="text-red-500">*</span>
                    </label>
                    <SkillsInput 
                        requiredSkills={requiredSkills} 
                        setRequiredSkills={setRequiredSkills} 
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        These keywords will be used to match job seekers.
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring focus:ring-blue-200 transition"
                        placeholder="Describe the role, responsibilities, and qualifications..."
                        required
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`${
                        loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    } text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300`}
                >
                    {loading ? "Posting Job..." : <><Send size={18} /> Publish Job Post</>}
                </button>
            </form>
        </div>
    );
}

// Helper component for simple text inputs
const InputField = ({ label, name, value, onChange, placeholder, type = "text", required = false }) => (
    <div>
        <label className="block text-gray-700 font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring focus:ring-blue-200 transition"
            placeholder={placeholder}
            required={required}
        />
    </div>
);
