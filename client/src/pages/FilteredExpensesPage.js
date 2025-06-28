import React, { useEffect, useContext, useState } from 'react';
import { TransactionProvider, TransactionContext } from '../context/TransactionContext';
import TransactionList from '../components/TransactionList';
import Filters from '../components/Filters';

function FilteredExpensesContent() {
    const { fetchTransactions, transactions } = useContext(TransactionContext);
    const [filterParams, setFilterParams] = useState({ type: 'expense' });

    useEffect(() => { fetchTransactions(filterParams); }, [filterParams, fetchTransactions]);
    const expenses = transactions.filter(t => t.type === 'expense');

    const handleFilter = params => {
        setFilterParams({ ...params, type: 'expense' });
    };

    return (
        <div className="expenses-page">
            <h2>Filtered Expenses</h2>
            <Filters onFilter={handleFilter} />
            <TransactionList transactions={expenses} />
        </div>
    );
}

function FilteredExpensesPage() {
    return (
        <TransactionProvider>
            <FilteredExpensesContent />
        </TransactionProvider>
    );
}

export default FilteredExpensesPage; 