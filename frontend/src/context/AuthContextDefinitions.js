// frontend/src/context/AuthContextDefinitions.js

import { createContext, useContext } from 'react';

// 1. Create the Context
export const AuthContext = createContext();

// 2. Custom hook to use the Auth Context easily
export const useAuth = () => useContext(AuthContext);