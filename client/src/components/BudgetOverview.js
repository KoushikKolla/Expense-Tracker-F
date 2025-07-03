import React, { useContext, useMemo } from 'react';
import { TransactionContext } from '../context/TransactionContext';

function BudgetOverview() {
    const { transactions } = useContext(TransactionContext);

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        let totalIncome = 0, totalExpense = 0;
        transactions.forEach(t => {
            if (t.type === 'income') totalIncome += t.amount;
            else totalExpense += t.amount;
        });
        return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
    }, [transactions]);

    const formatINR = amount => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    return (
        <div className="budget-overview card">
            <h3>Budget Overview</h3>
            <div>Total Income: <span className="income">{formatINR(totalIncome)}</span></div>
            <div>Total Expense: <span className="expense">{formatINR(totalExpense)}</span></div>
            <div>Remaining: <span className={balance < 0 ? 'negative' : ''}>{formatINR(balance)}</span></div>
        </div>
    );
}

export default BudgetOverview; 