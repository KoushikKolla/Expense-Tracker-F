import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const { signup } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [groupName, setGroupName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(username, email, password, groupName);
            setTimeout(() => navigate('/dashboard'), 500);
        } catch (err) {
            setError(err?.response?.data?.message || 'Signup failed');
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

                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Create Account</h2>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label htmlFor="signup-username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Username</label>
                        <input
                            type="text"
                            id="signup-username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            placeholder="Choose a username"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label htmlFor="signup-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            id="signup-email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left', position: 'relative' }}>
                        <label htmlFor="signup-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="signup-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                placeholder="Create a password"
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

                    <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label htmlFor="signup-group" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Group Name (Optional)</label>
                        <input
                            type="text"
                            id="signup-group"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            placeholder="e.g. MyFamily"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>

                    {error && <div style={{
                        marginTop: '1rem', padding: '0.75rem', borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600
                    }}>
                        {error}
                    </div>}
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;