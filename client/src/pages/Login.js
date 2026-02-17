import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
            // Small delay to ensure token is set
            setTimeout(() => navigate('/dashboard'), 100);
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="auth-container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    }}>
                        <img src="https://img.icons8.com/color/48/000000/rupee.png" alt="logo" style={{ width: 36, height: 36 }} />
                    </div>
                    <h1 style={{ textAlign: 'center', margin: 0, fontWeight: 700, fontSize: '1.75rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
                        Smart Expense Tracker
                    </h1>
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Login</h2>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label htmlFor="login-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            id="login-email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left', position: 'relative' }}>
                        <label htmlFor="login-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="login-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', padding: 0, boxShadow: 'none'
                                }}
                            >
                                {showPassword ? (
                                    <img src="https://img.icons8.com/ios-glyphs/30/94a3b8/invisible.png" alt="hide" style={{ width: 20, height: 20 }} />
                                ) : (
                                    <img src="https://img.icons8.com/ios-glyphs/30/94a3b8/visible--v1.png" alt="show" style={{ width: 20, height: 20 }} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={e => setRemember(e.target.checked)}
                                style={{ width: 'auto', marginRight: '0.5rem', margin: 0 }}
                            /> Remember me
                        </label>
                        <Link to="#" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</Link>
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {error && <div style={{
                        marginTop: '1rem', padding: '0.75rem', borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600
                    }}>
                        {error}
                    </div>}
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;