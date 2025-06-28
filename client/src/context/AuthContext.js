import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loginTime, setLoginTime] = useState(() => {
        const stored = localStorage.getItem('loginTime');
        return stored ? new Date(stored) : null;
    });

    useEffect(() => {
        if (token) {
            axios.get(`${process.env.REACT_APP_API_URL}/auth/user`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => setUser(res.data))
                .catch(() => logout());
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        const now = new Date();
        setLoginTime(now);
        localStorage.setItem('loginTime', now.toISOString());
    };

    const signup = async (username, email, password) => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, { username, email, password });
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        const now = new Date();
        setLoginTime(now);
        localStorage.setItem('loginTime', now.toISOString());
    };

    const updateProfile = async (data) => {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/auth/profile`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
    };

    const updateAvatar = async (avatar) => {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/auth/avatar`, { avatar }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
    };

    const deleteAccount = async () => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/auth/account`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        logout();
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setLoginTime(null);
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, updateProfile, updateAvatar, deleteAccount, loginTime }}>
            {children}
        </AuthContext.Provider>
    );
}; 