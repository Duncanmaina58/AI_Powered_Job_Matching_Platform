// frontend/src/services/authService.js

import axios from 'axios';

// ⚠️ IMPORTANT: Verify your backend port (5000 is standard)
const API_URL = 'http://localhost:5000/api/users/'; 

// --- Register User ---
const register = async (userData) => {
    // userData should contain { name, email, password, role, ... }
    const response = await axios.post(API_URL + 'register', userData);

    if (response.data.token) {
        // Store user data and token in local storage
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// --- Login User ---
const login = async (userData) => {
    // userData should contain { email, password, role }
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data.token) {
        // Store user data and token in local storage
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// --- Logout User ---
const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    logout,
    login,
};

export default authService;