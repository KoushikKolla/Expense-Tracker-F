import React, { useEffect, useContext } from 'react';
import MonthlyUsageChart from '../charts/MonthlyUsageChart';
import { TransactionProvider, TransactionContext } from '../context/TransactionContext';

function MonthlyUsageContent() {
    const { fetchTransactions } = useContext(TransactionContext);
    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <h2>Monthly Usage</h2>
            <MonthlyUsageChart />
        </div>
    );
}

function MonthlyUsagePage() {
    return (
        <TransactionProvider>
            <MonthlyUsageContent />
        </TransactionProvider>
    );
}

export default MonthlyUsagePage; 