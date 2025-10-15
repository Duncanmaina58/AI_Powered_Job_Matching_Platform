import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Briefcase, MapPin, Calendar, FileText, Trash2, Loader2, CheckCircle, X, ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-transform duration-300 scale-100">
                <div className="flex justify-between items-start border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                        <AlertTriangle size={24} /> {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        {isLoading ? "Withdrawing..." : "Confirm Withdraw"}
                    </button>
                </div>
            </div>
        </div>
    );
};

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

const MyApplications = () => {
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
            const res = await axios.get("http://localhost:5000/api/jobs/jobseeker/applications", { headers: { Authorization: `Bearer ${token}` } });
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

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                <p className="text-xl font-medium text-gray-600">Loading your job applications...</p>
            </div>
        );
    }

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center p-10 bg-red-50 border border-red-200 rounded-xl shadow-inner">
                    <AlertTriangle className="text-red-500 mx-auto mb-4" size={32} />
                    <p className="text-lg font-medium text-red-700">{error}</p>
                </div>
            );
        }

        if (applications.length === 0) {
            return (
                <div className="text-center p-10 bg-blue-50 border border-blue-200 rounded-xl shadow-inner">
                    <Briefcase className="text-blue-500 mx-auto mb-4" size={32} />
                    <p className="text-xl font-semibold text-blue-800">No Applications Found</p>
                    <p className="text-blue-600 mt-2">Start your job search today!</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                    <div
                        key={app._id}
                        className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:border-blue-200"
                    >
                        <div className="mb-4 flex-grow">
                            <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                                {app.job?.title || "Untitled Job"}
                            </h2>
                            <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                <Briefcase size={14} /> {app.job?.company || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <p className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                {app.job?.location || "Not specified"}
                            </p>
                            <p className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <StatusBadge status={app.status || "Pending"} />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(app.cv, "_blank", "noopener,noreferrer")}
                                    className="p-2 text-gray-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition duration-150"
                                    title="View Submitted CV"
                                >
                                    <FileText size={20} />
                                </button>
                                {app.status === "Pending" && (
                                    <button
                                        onClick={() => handleWithdraw(app)}
                                        className="p-2 text-red-500 rounded-full hover:bg-red-50 hover:text-red-600 transition duration-150"
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
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center border-b pb-4 mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                        <ArrowLeft className="text-blue-600 hidden sm:block" size={32} />
                        My Job Applications
                    </h1>
                    <button
                        onClick={fetchApplications}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
                {withdrawMessage && (
                    <div className={`mb-6 p-4 rounded-lg font-medium shadow-md ${
                        withdrawMessage.type === 'success' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-red-100 text-red-800 border-red-300'
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
            />
        </div>
    );
};

export default MyApplications;
