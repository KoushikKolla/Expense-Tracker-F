import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import Profile from './pages/Profile';
import MonthlyUsagePage from './pages/MonthlyUsagePage';
import BillUpload from './pages/BillUpload';
import BillsList from './pages/BillsList';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DarkModeProvider, DarkModeContext } from './context/DarkModeContext';
import './App.css';

function NavBar() {
    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <header className="main-header">
            <Link to="/dashboard" className="header-title">
                <img src="https://img.icons8.com/color/48/000000/rupee.png" alt="logo" className="nav-logo" />
                <span>Expense Tracker</span>
            </Link>
            
            <nav className="main-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                    <img src="https://img.icons8.com/?size=100&id=JtOasgwoFNyW&format=png&color=000000" alt="dashboard" className="nav-icon" /> 
                    Dashboard
                </NavLink>
                <NavLink to="/expenses" className={({ isActive }) => isActive ? 'active' : ''}>
                    <img src="https://img.icons8.com/fluency/512/wallet.png" alt="expenses" className="nav-icon" /> 
                    Expenses
                </NavLink>
                <NavLink to="/bills" className={({ isActive }) => isActive ? 'active' : ''}>
                    <img src="https://img.icons8.com/?size=100&id=123456&format=png&color=000000" alt="bills" className="nav-icon" /> 
                    Bills
                </NavLink>
                <NavLink to="/monthly-usage" className={({ isActive }) => isActive ? 'active' : ''}>
                    <img src="https://img.icons8.com/?size=100&id=FSrTPNNurgeY&format=png&color=000000" alt="monthly usage" className="nav-icon" /> 
                    Analytics
                </NavLink>
                
                <div style={{ width: '1px', height: '20px', background: 'var(--text-secondary)', opacity: 0.2, margin: '0 0.5rem' }}></div>

                <NavLink to="/profile" className="profile-icon-link" title="Profile">
                    <img src="https://img.icons8.com/?size=100&id=9r19HDmevkSh&format=png&color=000000" alt="profile" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                </NavLink>

                <button className="darkmode-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
                    <img src="https://img.icons8.com/?size=100&id=45475&format=png&color=000000" alt="toggle dark mode" style={{ width: 20, height: 20, filter: darkMode ? 'invert(1)' : 'none' }} />
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
                <div className="app-container">
                    {!hideNav && <NavBar />}
                    <div className="content-wrapper">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/expenses" element={<ExpensesPage />} />
                            <Route path="/bills" element={<BillsList />} />
                            <Route path="/upload-bill" element={<BillUpload />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/monthly-usage" element={<MonthlyUsagePage />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    </div>
                </div>
            </AuthProvider>
        </DarkModeProvider>
    );
}

export default App;