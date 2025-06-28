import React, { useEffect, useContext } from 'react';
import BudgetOverview from '../components/BudgetOverview';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { TransactionProvider, TransactionContext } from '../context/TransactionContext';

function DashboardContent() {
    const { fetchTransactions } = useContext(TransactionContext);
    useEffect(() => { fetchTransactions(); }, []);
    return (
        <div className="dashboard">
            <BudgetOverview />
            <TransactionForm />
            <TransactionList />
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