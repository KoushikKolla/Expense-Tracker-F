import React, { useEffect, useContext, useState } from 'react';
import BudgetOverview from '../components/BudgetOverview';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { TransactionProvider, TransactionContext } from '../context/TransactionContext';

function DashboardContent() {
    const { fetchTransactions, updateTransaction } = useContext(TransactionContext);
    const [editTransaction, setEditTransaction] = useState(null);
    useEffect(() => { fetchTransactions(); }, []);
    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
    };
    const handleUpdate = async (updated) => {
        await updateTransaction(editTransaction._id, updated);
        setEditTransaction(null);
    };
    return (
        <div className="dashboard">
            <BudgetOverview />
            {editTransaction ? (
                <div className="modal-overlay" onClick={() => setEditTransaction(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Edit Transaction</h3>
                        <TransactionForm initialValues={editTransaction} onSubmit={handleUpdate} />
                        <button className="cancel-btn" onClick={() => setEditTransaction(null)}>Cancel</button>
                    </div>
                </div>
            ) : <TransactionForm />}
            <TransactionList onEdit={handleEdit} />
        </div>
    );
}

function Dashboard() {
    return (
        <TransactionProvider>
            <DashboardContent />
        </TransactionProvider>
    );
}

export default Dashboard; 