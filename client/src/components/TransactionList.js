import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

function TransactionList({ transactions: propTransactions, onEdit, user }) {
    const { transactions: contextTransactions, deleteTransaction } = useContext(TransactionContext);
    const transactions = propTransactions || contextTransactions;

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleDelete = (t) => {
        // Allow deletion if user owns it OR if no user info is present (local fallback)
        if (user && t.createdBy && (user._id !== t.createdBy._id && user._id !== t.createdBy)) {
            alert('You cannot delete this transaction.');
            return;
        }
        if (window.confirm('Delete this transaction?')) {
            deleteTransaction(t._id);
        }
    };

    const handleEdit = (t) => {
        if (user && t.createdBy && (user._id !== t.createdBy._id && user._id !== t.createdBy)) {
            alert('You cannot edit this transaction.');
            return;
        }
        if (onEdit) onEdit(t);
    };

    return (
        <div className="transaction-list">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Recent Transactions</h3>
            {transactions.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No transactions found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t._id}>
                                <td style={{ fontWeight: 500 }}>{t.title}</td>
                                <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1.05rem' }}>
                                    {formatINR(t.amount)}
                                </td>
                                <td>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem',
                                        background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)'
                                    }}>
                                        {t.category}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td>
                                    <span style={{
                                        color: t.type === 'expense' ? 'var(--danger)' : 'var(--success)',
                                        fontWeight: 600,
                                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                                    }}>
                                        {t.type === 'expense' ? 'Expense' : 'Income'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(t)}
                                            style={{
                                                background: 'var(--primary)', color: '#fff', padding: '6px 12px',
                                                borderRadius: '6px', fontSize: '0.85rem', border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(t)}
                                            style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TransactionList;