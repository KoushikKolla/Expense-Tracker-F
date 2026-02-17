import React, { useContext, useMemo } from 'react';
import { TransactionContext } from '../context/TransactionContext';

function BudgetOverview() {
    const { transactions } = useContext(TransactionContext);

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach(t => {
            if (t.type === 'income') totalIncome += t.amount;
            else if (t.type === 'expense') totalExpense += t.amount;
        });
        return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
    }, [transactions]);

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="budget-overview">
            <div className="budget-card">
                <h3>Total Income</h3>
                <div className="amount" style={{ color: 'var(--success)' }}>
                    {formatINR(totalIncome)}
                </div>
            </div>

            <div className="budget-card">
                <h3>Total Expense</h3>
                <div className="amount" style={{ color: 'var(--danger)' }}>
                    {formatINR(totalExpense)}
                </div>
            </div>

            <div className="budget-card">
                <h3>Balance</h3>
                <div className="amount" style={{ color: balance >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
                    {formatINR(balance)}
                </div>
            </div>
        </div>
    );
}

export default BudgetOverview;