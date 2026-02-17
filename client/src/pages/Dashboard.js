import React, { useEffect, useContext, useState } from 'react';
import BudgetOverview from '../components/BudgetOverview';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { TransactionProvider, TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';

function DashboardContent() {
    const { fetchTransactions, updateTransaction } = useContext(TransactionContext);
    const { user } = useContext(AuthContext);
    const [editTransaction, setEditTransaction] = useState(null);
    useEffect(() => { fetchTransactions(); }, []);
    const handleEdit = (transaction) => {
        if (!user || !transaction.createdBy || (user._id !== transaction.createdBy._id && user._id !== transaction.createdBy)) {
            alert('You cannot update this transaction.');
            return;
        }
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
                        <TransactionForm
                            initialValues={editTransaction}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditTransaction(null)} // Pass cancel handler
                        />
                    </div>
                </div>
            ) : <TransactionForm />}
            <TransactionList onEdit={handleEdit} user={user} />
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