import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import Profile from './pages/Profile';
import MonthlyUsagePage from './pages/MonthlyUsagePage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DarkModeProvider, DarkModeContext } from './context/DarkModeContext';
import './App.css';

function NavBar() {
    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <header className="main-header">
            <Link to="/dashboard" className="header-title" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <img src="https://img.icons8.com/color/48/000000/rupee.png" alt="logo" style={{ width: 36, height: 36, verticalAlign: 'middle' }} />
                <span>Smart Expense Tracker</span>
            </Link>
            <nav className="main-nav">
                <Link to="/dashboard">
                    <img src="https://img.icons8.com/?size=100&id=JtOasgwoFNyW&format=png&color=000000" alt="dashboard" style={{ width: 24, height: 24, verticalAlign: 'middle' }} /> Dashboard
                </Link>
                <Link to="/expenses">
                    <img src="https://img.icons8.com/fluency/512/wallet.png" alt="expenses" style={{ width: 28, height: 28, verticalAlign: 'middle' }} /> Expenses
                </Link>
                <Link to="/monthly-usage">
                    <img src="https://img.icons8.com/?size=100&id=FSrTPNNurgeY&format=png&color=000000" alt="monthly usage" style={{ width: 26, height: 26, verticalAlign: 'middle' }} /> Monthly Usage
                </Link>
                <span style={{ flex: 1 }} />
                <Link to="/profile" className="profile-icon-link" title="Profile">
                    <img src="https://img.icons8.com/?size=100&id=9r19HDmevkSh&format=png&color=000000" alt="profile" style={{ width: 28, height: 28, verticalAlign: 'middle', borderRadius: '50%' }} />
                </Link>
                <button className="darkmode-toggle" onClick={toggleDarkMode} title="Toggle dark mode" style={{ background: 'none', border: 'none', padding: 0, margin: '0 10px', cursor: 'pointer' }}>
                    <img src="https://img.icons8.com/?size=100&id=45475&format=png&color=000000" alt="toggle dark mode" style={{ width: 28, height: 28, filter: darkMode ? 'invert(1)' : 'none' }} />
                </button>
                {user && (
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                )}
            </nav>
        </header>
    );
}

function App() {
    const location = useLocation();
    const hideNav = location.pathname === '/login' || location.pathname === '/signup';
    return (
        <DarkModeProvider>
            <AuthProvider>
                {!hideNav && <NavBar />}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/monthly-usage" element={<MonthlyUsagePage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </DarkModeProvider>
    );
}

export default App; 