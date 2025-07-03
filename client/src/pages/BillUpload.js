import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import './BillUpload.css';

const BillUpload = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { isDarkMode } = useContext(DarkModeContext);

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: '',
        type: 'expense',
        description: '',
        merchant: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Healthcare',
        'Education',
        'Utilities',
        'Housing',
        'Travel',
        'Business',
        'Other'
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB');
            return;
        }

        // Validate file type
        if (!['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            setError('Only PDF and JPG files are allowed');
            return;
        }

        setSelectedFile(file);
        setError('');

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFilePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('billFile', selectedFile);

            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await axios.post('http://localhost:5000/api/bills/upload',
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSuccess('Bill uploaded successfully!');
            setFormData({
                title: '',
                amount: '',
                category: '',
                date: '',
                type: 'expense',
                description: '',
                merchant: ''
            });
            setSelectedFile(null);
            setFilePreview(null);

            // Reset file input
            e.target.reset();

        } catch (error) {
            setError(error.response?.data?.message || 'Error uploading bill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`bill-upload ${isDarkMode ? 'dark' : ''}`}>
            <div className="bill-upload-container">
                <h1>Upload Bill</h1>
                <p className="subtitle">Upload your bills in PDF or JPG format with transaction details</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="bill-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="title">Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount">Amount (₹) *</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date *</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="type">Type *</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="merchant">Merchant/Vendor *</label>
                            <input
                                type="text"
                                id="merchant"
                                name="merchant"
                                value={formData.merchant}
                                onChange={handleInputChange}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="billFile">Bill File (PDF or JPG) *</label>
                        <input
                            type="file"
                            id="billFile"
                            name="billFile"
                            accept=".pdf,.jpg,.jpeg"
                            onChange={handleFileSelect}
                            required
                        />
                        <small>Maximum file size: 2MB</small>
                    </div>

                    {filePreview && (
                        <div className="file-preview">
                            <h4>File Preview:</h4>
                            <img src={filePreview} alt="Bill preview" />
                        </div>
                    )}

                    {selectedFile && !filePreview && (
                        <div className="file-preview">
                            <h4>Selected File:</h4>
                            <p>{selectedFile.name} (PDF)</p>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload Bill'}
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BillUpload; 