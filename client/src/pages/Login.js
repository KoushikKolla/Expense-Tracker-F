import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password, remember);
            setTimeout(() => navigate('/dashboard'), 500);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Invalid credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(120deg, #e0e7ef 0%, #c3cfe2 50%, #f5f7fa 100%)',
            fontFamily: 'Inter, Roboto, system-ui, sans-serif',
            boxSizing: 'border-box',
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.75)',
                borderRadius: 28,
                boxShadow: '0 8px 40px 0 rgba(30,60,90,0.18)',
                padding: '48px 0 36px 0',
                minWidth: 320,
                maxWidth: 400,
                width: '90vw',
                border: '1.5px solid rgba(200,200,200,0.18)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxSizing: 'border-box',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #ffe082 60%, #ffd54f 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                        boxShadow: '0 2px 16px 0 #ffd54f88',
                    }}>
                        <img src="https://img.icons8.com/color/48/000000/rupee.png" alt="logo" style={{ width: 36, height: 36 }} />
                    </div>
                    <h1 style={{ textAlign: 'center', margin: 0, fontWeight: 900, fontSize: 28, letterSpacing: 0.5, color: '#1976d2', textShadow: '0 2px 8px #e3e8ee' }}>Smart Expense Tracker</h1>
                </div>
                <h2 style={{ textAlign: 'center', margin: '18px 0 28px 0', fontWeight: 700, fontSize: 22, color: '#222', letterSpacing: 0.2 }}>Login</h2>
                <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '88%', display: 'flex', flexDirection: 'column', gap: 24, boxSizing: 'border-box' }}>
                    <label htmlFor="login-email" style={{ fontWeight: 600, color: '#444', marginBottom: 6, marginLeft: 2 }}>Email</label>
                    <div style={{ position: 'relative', marginBottom: 8, width: '100%', boxSizing: 'border-box' }}>
                        <input
                            type="email"
                            id="login-email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                            autoComplete="off"
                            placeholder="Enter your email"
                            style={{
                                width: '100%', height: 50, borderRadius: 14, border: 'none', fontSize: 17,
                                paddingLeft: 18, background: 'rgba(245,247,250,0.85)',
                                outline: 'none', fontWeight: 500, color: '#222',
                                boxShadow: '0 2px 8px 0 #e3e8ee',
                                transition: 'box-shadow 0.2s',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <label htmlFor="login-password" style={{ fontWeight: 600, color: '#444', marginBottom: 6, marginLeft: 2 }}>Password</label>
                    <div style={{ position: 'relative', marginBottom: 8, width: '100%', boxSizing: 'border-box' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="login-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Enter your password"
                            style={{
                                width: '100%', height: 50, borderRadius: 14, border: 'none', fontSize: 17,
                                paddingLeft: 18, paddingRight: 44, background: 'rgba(245,247,250,0.85)',
                                outline: 'none', fontWeight: 500, color: '#222',
                                boxShadow: '0 2px 8px 0 #e3e8ee',
                                transition: 'box-shadow 0.2s',
                                boxSizing: 'border-box',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(s => !s)}
                            tabIndex={-1}
                            style={{ position: 'absolute', right: 12, top: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#1976d2" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12c-4.41 0-7.34-3.36-8.46-5C4.66 8.36 7.59 5 12 5s7.34 3.36 8.46 5C19.34 13.64 16.41 17 12 17Zm0-10a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" /></svg>
                            ) : (
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#1976d2" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12c-4.41 0-7.34-3.36-8.46-5C4.66 8.36 7.59 5 12 5s7.34 3.36 8.46 5C19.34 13.64 16.41 17 12 17Zm0-10a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" /></svg>
                            )}
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                        <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#555', fontWeight: 500 }}>
                            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ marginRight: 7 }} /> Remember me
                        </label>
                        <a href="#" style={{ color: '#1976d2', fontSize: 15, textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
                    </div>
                    <button type="submit" disabled={loading} style={{
                        height: 50, borderRadius: 14, background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: '#fff', fontWeight: 700, fontSize: 19, border: 'none', marginTop: 8,
                        cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? '0 0 0 2px #1976d2' : '0 2px 8px #1976d2aa', transition: 'background 0.2s', width: '100%',
                        letterSpacing: 0.5
                    }}>
                        {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner" style={{ width: 24, height: 24, border: '3px solid #fff', borderTop: '3px solid #1976d2', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: 10 }}></span>Logging in...</span> : 'Login'}
                    </button>
                    {error && <div style={{ background: '#ffeaea', color: '#e53935', borderRadius: 10, padding: '12px 0', textAlign: 'center', fontWeight: 600, marginTop: 2, boxShadow: '0 2px 8px rgba(229,57,53,0.08)', fontSize: 15 }}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6, verticalAlign: 'middle' }}><path fill="#e53935" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" /></svg>
                        {error}
                    </div>}
                </form>
                <p style={{ textAlign: 'center', marginTop: 28, fontSize: 16 }}>Don't have an account? <a href="/signup" style={{ color: '#1976d2', fontWeight: 700 }}>Sign up</a></p>
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @media (max-width: 500px) {
                    div[style*='minHeight: 100vh'] > div { min-width: 97vw !important; max-width: 99vw !important; padding: 22px 3vw 18px 3vw !important; }
                }
            `}</style>
        </div>
    );
}

export default Login; 