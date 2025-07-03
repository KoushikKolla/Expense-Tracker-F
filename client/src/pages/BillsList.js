import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import './BillsList.css';

const BillsList = () => {
    const { token } = useContext(AuthContext);
    const { isDarkMode } = useContext(DarkModeContext);

    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/bills/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBills(response.data);
        } catch (error) {
            setError('Error fetching bills');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBill = async (transactionId) => {
        if (!window.confirm('Are you sure you want to delete this bill?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/bills/${transactionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBills(bills.filter(bill => bill._id !== transactionId));
        } catch (error) {
            setError('Error deleting bill');
            console.error('Error:', error);
        }
    };

    const openModal = (bill) => {
        setSelectedBill(bill);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBill(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getFileUrl = (fileId) => {
        return `http://localhost:5000/api/bills/file/${fileId}`;
    };

    if (loading) {
        return (
            <div className={`bills-list ${isDarkMode ? 'dark' : ''}`}>
                <div className="loading">Loading bills...</div>
            </div>
        );
    }

    return (
        <div className={`bills-list ${isDarkMode ? 'dark' : ''}`}>
            <div className="bills-container">
                <div className="bills-header">
                    <h1>My Bills</h1>
                    <Link to="/upload-bill" className="upload-btn">
                        📄 Upload New Bill
                    </Link>
                </div>

                {error && <div className="error-message">{error}</div>}

                {bills.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h3>No bills uploaded yet</h3>
                        <p>Start by uploading your first bill to keep track of your expenses</p>
                        <Link to="/upload-bill" className="upload-btn">
                            Upload Your First Bill
                        </Link>
                    </div>
                ) : (
                    <div className="bills-grid">
                        {bills.map((bill) => (
                            <div key={bill._id} className="bill-card">
                                <div className="bill-header">
                                    <h3>{bill.title}</h3>
                                    <span className={`type-badge ${bill.type}`}>
                                        {bill.type}
                                    </span>
                                </div>

                                <div className="bill-details">
                                    <div className="detail-row">
                                        <span className="label">Amount:</span>
                                        <span className={`amount ${bill.type}`}>
                                            {formatAmount(bill.amount)}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Category:</span>
                                        <span>{bill.category}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Date:</span>
                                        <span>{formatDate(bill.date)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">File:</span>
                                        <span>{bill.billFile?.filename || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="bill-actions">
                                    <button
                                        className="view-btn"
                                        onClick={() => openModal(bill)}
                                    >
                                        👁️ View Bill
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteBill(bill._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for viewing bill */}
            {showModal && selectedBill && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedBill.title}</h2>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="bill-info">
                                <div className="info-row">
                                    <span className="label">Amount:</span>
                                    <span className={`amount ${selectedBill.type}`}>
                                        {formatAmount(selectedBill.amount)}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Category:</span>
                                    <span>{selectedBill.category}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Date:</span>
                                    <span>{formatDate(selectedBill.date)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Type:</span>
                                    <span className={`type-badge ${selectedBill.type}`}>
                                        {selectedBill.type}
                                    </span>
                                </div>
                            </div>

                            {selectedBill.billFile && (
                                <div className="bill-preview">
                                    <h4>Bill Preview:</h4>
                                    {selectedBill.billFile.fileType === 'pdf' ? (
                                        <div className="pdf-preview">
                                            <iframe
                                                src={getFileUrl(selectedBill.billFile.fileId)}
                                                title="Bill PDF"
                                                width="100%"
                                                height="400px"
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={getFileUrl(selectedBill.billFile.fileId)}
                                            alt="Bill preview"
                                            className="bill-image"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillsList; 