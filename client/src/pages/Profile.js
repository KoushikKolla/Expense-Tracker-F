import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Profile() {
    const { user, updateProfile, updateAvatar, loginTime, deleteAccount } = useContext(AuthContext);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
    const [password, setPassword] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef();
    if (!user) return <Navigate to="/login" />;

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleEdit = () => setEdit(true);
    const handleCancel = () => { setEdit(false); setForm({ username: user.username, email: user.email }); setPassword(''); setSuccess(''); setError(''); };
    const handleSave = async e => {
        e.preventDefault();
        try {
            await updateProfile({ ...form, password: password || undefined });
            setEdit(false);
            setPassword('');
            setSuccess('Profile updated successfully!');
            setError('');
        } catch (err) {
            setError('Failed to update profile.');
            setSuccess('');
        }
    };
    const handleAvatarChange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            setAvatarPreview(reader.result);
            try {
                await updateAvatar(reader.result);
                setSuccess('Avatar updated!');
                setError('');
            } catch {
                setError('Failed to update avatar.');
                setSuccess('');
            }
        };
        reader.readAsDataURL(file);
    };
    return (
        <div className="profile-card">
            <div className="profile-avatar-section">
                <img
                    src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`}
                    alt="avatar"
                    className="profile-avatar"
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                />
                <button className="profile-avatar-btn" type="button" onClick={() => fileInputRef.current.click()}>
                    Change Avatar
                </button>
            </div>
            <div className="profile-info-section">
                <h2>User Profile</h2>
                {success && <div className="profile-success">{success}</div>}
                {error && <div className="profile-error">{error}</div>}
                {!edit ? (
                    <>
                        <div><strong>Username:</strong> {user.username}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Group Name:</strong> {user.groupName || '—'}</div>
                        <div><strong>Registered:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
                        {loginTime && <div><strong>Logged in at:</strong> {loginTime.toLocaleString()}</div>}
                        <button className="profile-edit-btn" onClick={handleEdit}>Edit Profile</button>
                        <button
                            className="profile-delete-btn"
                            style={{
                                marginTop: 24,
                                background: '#e53935',
                                color: '#fff',
                                fontWeight: 700,
                                border: 'none',
                                borderRadius: 8,
                                padding: '12px 0',
                                width: '100%',
                                fontSize: 17,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px #e5393588',
                                letterSpacing: 0.5
                            }}
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                    try {
                                        await deleteAccount();
                                        // No need to set success, user will be logged out
                                    } catch (err) {
                                        setError('Failed to delete account.');
                                    }
                                }
                            }}
                        >
                            Delete Account
                        </button>
                    </>
                ) : (
                    <form className="profile-edit-form" onSubmit={handleSave}>
                        <div>
                            <label>Username: <input name="username" value={form.username} onChange={handleChange} required /></label>
                        </div>
                        <div>
                            <label>Email: <input name="email" value={form.email} onChange={handleChange} required /></label>
                        </div>
                        <div>
                            <label>New Password: <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" /></label>
                        </div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancel} style={{ marginLeft: 12 }}>Cancel</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile; 