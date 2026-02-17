import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import './BillsList.css';
import { FaTimes, FaTrash, FaEye } from 'react-icons/fa';

const BillsList = () => {
    const { token } = useContext(AuthContext);
    const { isDarkMode } = useContext(DarkModeContext);

    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [modalHiding, setModalHiding] = useState(false);

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

    const fetchBillFile = async (fileId) => {
        console.log('Fetching bill file with token:', token);
        const response = await fetch(
            `http://localhost:5000/api/bills/file/${fileId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        if (!response.ok) {
            throw new Error('File not found');
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    const openModal = async (bill) => {
        setSelectedBill(bill);
        setShowModal(true);
        setFileError(null);
        if (bill.billFile) {
            try {
                const url = await fetchBillFile(bill.billFile.fileId);
                setFileUrl(url);
                setFileError(null);
            } catch (err) {
                setFileUrl(null);
                setFileError('Bill file not found or has been deleted.');
            }
        }
    };

    const closeModal = () => {
        setModalHiding(true);
        setTimeout(() => {
            setShowModal(false);
            setSelectedBill(null);
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
                setFileUrl(null);
            }
            setFileError(null);
            setModalHiding(false);
        }, 220); // match CSS transition duration
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

    // Accessibility: close modal on Esc
    useEffect(() => {
        if (!showModal) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal]);

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
                                        aria-label="View bill"
                                    >
                                        <FaEye style={{ marginRight: 6 }} /> View
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteBill(bill._id)}
                                        aria-label="Delete bill"
                                    >
                                        <FaTrash style={{ marginRight: 6 }} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for viewing bill */}
            {showModal && selectedBill && (
                <div className={`modal-overlay${modalHiding ? ' hide' : ''}`} onClick={closeModal} aria-modal="true" role="dialog">
                    <div className={`modal-content${modalHiding ? ' hide' : ''}`} onClick={(e) => e.stopPropagation()} tabIndex={-1}>
                        <div className="modal-header">
                            <h2>{selectedBill.title}</h2>
                            <button className="close-btn" onClick={closeModal} aria-label="Close bill preview">
                                <FaTimes />
                            </button>
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
                                fileError ? (
                                    <div style={{ color: 'red', textAlign: 'center', margin: 16 }}>{fileError}</div>
                                ) : fileUrl ? (
                                    selectedBill.billFile.fileType === 'pdf' ? (
                                        <div className="pdf-preview">
                                            <iframe
                                                src={fileUrl}
                                                title="Bill PDF"
                                                width="100%"
                                                height="400px"
                                                style={{ border: 'none', borderRadius: 8 }}
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={fileUrl}
                                            alt="Bill"
                                            className="bill-image"
                                        />
                                    )
                                ) : (
                                    <div className="spinner" aria-label="Loading bill preview"></div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillsList; 