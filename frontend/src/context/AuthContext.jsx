import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        // Check local storage for persistent login
        const storedUser = localStorage.getItem('orbitUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/library/user', { username });
            setUser(data);
            localStorage.setItem('orbitUser', JSON.stringify(data));
            setIsLoginModalOpen(false);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, error: 'Login failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('orbitUser');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isLoginModalOpen,
            setIsLoginModalOpen
        }}>
            {children}
        </AuthContext.Provider>
    );
};
