import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

function TransactionList({ transactions: propTransactions, onEdit }) {
    const { transactions: contextTransactions, deleteTransaction } = useContext(TransactionContext);
    const transactions = propTransactions || contextTransactions;
    const formatINR = amount => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    return (
        <div className="transaction-list">
            <h3>Transactions</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t._id}>
                            <td>{t.title}</td>
                            <td>{formatINR(t.amount)}</td>
                            <td>{t.category}</td>
                            <td>{new Date(t.date).toLocaleDateString()}</td>
                            <td style={{ color: t.type === 'expense' ? '#e53935' : '#388e3c', fontWeight: 600 }}>
                                {t.type === 'expense' ? 'Expense' : 'Income'}
                            </td>
                            <td>
                                <button className="delete-btn" onClick={() => deleteTransaction(t._id)}>Delete</button>
                                <button className="edit-btn" style={{ marginLeft: 8 }} onClick={() => onEdit && onEdit(t)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList; 