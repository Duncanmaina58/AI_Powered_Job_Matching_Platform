// frontend/src/context/AuthContext.jsx

import React, { useState } from 'react'; // ✅ Need useState for the component state
import authService from '../services/authService'; // ✅ Need authService for API calls
// ⚠️ We only need AuthContext here, useAuth stays in the Definitions file.
import { AuthContext } from './AuthContextDefinitions'; 

// 1. Check local storage for existing user (for persistence)
const storedUser = localStorage.getItem('user'); 
const initialUserState = storedUser ? JSON.parse(storedUser) : null; 
// ✅ 'initialUserState' is used below to initialize the state.

// 2. Context Provider Component (The ONLY export from this file)
export const AuthProvider = ({ children }) => {
    // ✅ useState is now used for state management
    const [user, setUser] = useState(initialUserState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Actions ---

    const login = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.login(userData);
            setUser(data);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            setError(errorMessage);
            setUser(null);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.register(userData);
            setUser(data);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            setError(errorMessage);
            setUser(null);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };
    
    // Derived state
    const isEmployer = user?.role === 'employer';
    const isJobSeeker = user?.role === 'jobseeker'; 

    // ✅ 'value' is defined here for the Provider
    const value = { 
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isEmployer,
        isJobSeeker,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};