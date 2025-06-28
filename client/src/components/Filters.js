import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

export const EXPENSE_CATEGORIES = [
    'Education', 'Utilities', 'Food', 'Health', 'Other'
];
export const INCOME_CATEGORIES = [
    'Salary', 'Business', 'Investment', 'Gift', 'Other'
];

function Filters({ onFilter }) {
    const { fetchTransactions } = useContext(TransactionContext);
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [search, setSearch] = useState('');

    const handleFilter = e => {
        e.preventDefault();
        const params = { category, type, startDate, endDate, search };
        if (onFilter) onFilter(params);
        else fetchTransactions(params);
    };

    // Choose categories based on type
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <form className="filters" onSubmit={handleFilter}>
            <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ maxHeight: 80, overflowY: 'auto', minWidth: 120 }}
            >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value="">All</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit">Filter</button>
        </form>
    );
}

export default Filters; 