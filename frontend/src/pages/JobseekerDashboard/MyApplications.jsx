import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Briefcase, MapPin, Calendar, FileText, Trash2, Loader2, CheckCircle, X, ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";

// --- ConfirmationModal component (Modified) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading, darkMode }) => {
    if (!isOpen) return null;

    // Apply dark mode styles to the modal
    const modalClasses = darkMode 
        ? "bg-gray-800 text-gray-200" 
        : "bg-white text-gray-900";

    const buttonBaseClasses = "px-4 py-2 text-sm font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-2";
    const cancelButtonClasses = darkMode 
        ? "text-gray-200 bg-gray-700 hover:bg-gray-600" 
        : "text-gray-700 bg-gray-100 hover:bg-gray-200";
    const confirmButtonClasses = "text-white bg-red-600 hover:bg-red-700";

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className={`${modalClasses} rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-transform duration-300 scale-100`}>
                <div className={`flex justify-between items-start border-b pb-3 mb-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
                        <AlertTriangle size={24} /> {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition">
                        <X size={24} />
                    </button>
                </div>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-6`}>{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`${buttonBaseClasses} ${cancelButtonClasses}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`${buttonBaseClasses} ${confirmButtonClasses}`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        {isLoading ? "Withdrawing..." : "Confirm Withdraw"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- StatusBadge component (No change needed) ---
const StatusBadge = ({ status }) => {
    let colorClass;
    let icon;
    switch (status) {
        case "Accepted":
            colorClass = "bg-green-100 text-green-700 border-green-200";
            icon = <CheckCircle size={14} className="mr-1" />;
            break;
        case "Rejected":
            colorClass = "bg-red-100 text-red-700 border-red-200";
            icon = <X size={14} className="mr-1" />;
            break;
        case "Pending":
            colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
            icon = <Calendar size={14} className="mr-1" />;
            break;
        default:
            colorClass = "bg-gray-100 text-gray-700 border-gray-200";
            icon = <Briefcase size={14} className="mr-1" />;
    }
    return (
        <span className={`flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${colorClass}`}>
            {icon}
            {status || "Unknown"}
        </span>
    );
};

// --- MyApplications component (Modified) ---
const MyApplications = ({ darkMode }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appToWithdraw, setAppToWithdraw] = useState(null);
    const [withdrawMessage, setWithdrawMessage] = useState(null);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setWithdrawMessage(null);
            const token = localStorage.getItem("token");
            if (!token) { throw new Error("Authentication token not found."); }
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/jobseeker/applications`, { headers: { Authorization: `Bearer ${token}` } });
            setApplications(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching applications:", err.response || err.message);
            setError("Unable to load your applications. Please ensure you are logged in and the backend is running.");
            setLoading(false);
        }
    }, []);

    const handleWithdrawConfirm = async () => {
        if (!appToWithdraw) return;
        setIsWithdrawing(true);
        try {
            const token = localStorage.getItem("token");
            // NOTE: The original URL had a hardcoded localhost. I'm keeping it for consistency but recommend using an environment variable.
            await axios.delete(`http://localhost:5000/api/jobs/jobseeker/applications/${appToWithdraw._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setApplications((prev) => prev.filter((app) => app._id !== appToWithdraw._id));
            setWithdrawMessage({ type: 'success', text: "Application withdrawn successfully!" });
        } catch (err) {
            console.error("Error withdrawing application:", err.response || err);
            setWithdrawMessage({ type: 'error', text: `Failed to withdraw application. Error: ${err.response?.data?.message || 'Network error'}` });
        } finally {
            setIsWithdrawing(false);
            setIsModalOpen(false);
            setAppToWithdraw(null);
        }
    };

    const handleWithdraw = (app) => {
        setAppToWithdraw(app);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Define Dark Mode classes
    const containerBgClass = darkMode ? "bg-gray-900" : "bg-gray-50";
    const loadingBgClass = darkMode ? "bg-gray-800" : "bg-gray-50";
    const loadingTextClass = darkMode ? "text-gray-400" : "text-gray-600";
    const cardBgClass = darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-100 text-gray-900";
    const cardTitleClass = darkMode ? "text-gray-100" : "text-gray-900";
    const cardDetailClass = darkMode ? "text-gray-400" : "text-gray-600";
    const headerTitleClass = darkMode ? "text-gray-100" : "text-gray-900";
    const headerBorderClass = darkMode ? "border-gray-700" : "border-gray-200";
    const refreshButtonClass = darkMode 
        ? "text-blue-400 bg-gray-700 border-gray-600 hover:bg-gray-600" 
        : "text-blue-600 bg-white border-blue-200 hover:bg-blue-50";
    const viewCVButtonClass = darkMode 
        ? "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
        : "text-gray-500 hover:bg-blue-50 hover:text-blue-600";
    const withdrawButtonClass = darkMode 
        ? "text-red-400 hover:bg-gray-700 hover:text-red-500"
        : "text-red-500 hover:bg-red-50 hover:text-red-600";

    if (loading) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${loadingBgClass}`}>
                <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                <p className={`text-xl font-medium ${loadingTextClass}`}>Loading your job applications...</p>
            </div>
        );
    }

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center p-10 bg-red-800/10 border border-red-800/20 rounded-xl shadow-inner dark:bg-red-900/20 dark:border-red-900/50">
                    <AlertTriangle className="text-red-500 mx-auto mb-4" size={32} />
                    <p className="text-lg font-medium text-red-700 dark:text-red-400">{error}</p>
                    <button 
                         onClick={fetchApplications}
                         className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition"
                    >
                         <RefreshCw size={16} /> Try Again
                    </button>
                </div>
            );
        }

        if (applications.length === 0) {
            return (
                <div className="text-center p-10 bg-blue-800/10 border border-blue-800/20 rounded-xl shadow-inner dark:bg-blue-900/20 dark:border-blue-900/50">
                    <Briefcase className="text-blue-500 mx-auto mb-4" size={32} />
                    <p className="text-xl font-semibold text-blue-800 dark:text-blue-300">No Applications Found</p>
                    <p className="text-blue-600 dark:text-blue-400 mt-2">Start your job search today!</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                    <div
                        key={app._id}
                        className={`${cardBgClass} shadow-xl rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:border-blue-400`}
                    >
                        <div className="mb-4 flex-grow">
                            <h2 className={`text-xl font-bold ${cardTitleClass} mb-1 leading-tight`}>
                                {app.job?.title || "Untitled Job"}
                            </h2>
                            <p className="text-sm text-blue-500 font-medium flex items-center gap-1">
                                <Briefcase size={14} /> {app.job?.company || "N/A"}
                            </p>
                        </div>
                        <div className={`space-y-2 text-sm ${cardDetailClass} mb-6`}>
                            <p className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                {app.job?.location || "Not specified"}
                            </p>
                            <p className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className={`flex justify-between items-center pt-4 border-t ${headerBorderClass}`}>
                            <StatusBadge status={app.status || "Pending"} />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(app.cv, "_blank", "noopener,noreferrer")}
                                    className={`p-2 rounded-full transition duration-150 ${viewCVButtonClass}`}
                                    title="View Submitted CV"
                                >
                                    <FileText size={20} />
                                </button>
                                {app.status === "Pending" && (
                                    <button
                                        onClick={() => handleWithdraw(app)}
                                        className={`p-2 rounded-full transition duration-150 ${withdrawButtonClass}`}
                                        title="Withdraw Application"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${containerBgClass} py-10 px-4 sm:px-6 lg:px-8 font-sans`}>
            <div className="max-w-7xl mx-auto">
                <div className={`flex justify-between items-center border-b pb-4 mb-8 ${headerBorderClass}`}>
                    <h1 className={`text-4xl font-extrabold ${headerTitleClass} flex items-center gap-3`}>
                        <ArrowLeft className="text-blue-500 hidden sm:block" size={32} />
                        My Job Applications
                    </h1>
                    <button
                        onClick={fetchApplications}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${refreshButtonClass}`}
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
                {withdrawMessage && (
                    <div className={`mb-6 p-4 rounded-lg font-medium shadow-md border ${
                        withdrawMessage.type === 'success' 
                            ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700' 
                            : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700'
                    }`}>
                        {withdrawMessage.text}
                    </div>
                )}
                {renderContent()}
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleWithdrawConfirm}
                isLoading={isWithdrawing}
                title="Withdraw Application"
                message={`Are you sure you want to withdraw your application for "${appToWithdraw?.job?.title || 'this job'}"? This action cannot be undone.`}
                darkMode={darkMode} // Pass darkMode to the modal
            />
        </div>
    );
};

export default MyApplications;