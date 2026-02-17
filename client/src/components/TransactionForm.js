import React, { useState, useContext, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
};

const EXPENSE_CATEGORIES = [
    'Transportation', 'Food', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Education', 'Rent', 'Travel', 'Other'
];
const INCOME_CATEGORIES = [
    'Salary', 'Business', 'Investment', 'Gift', 'Other'
];

const initialState = {
    title: '',
    amount: '',
    category: '',
    date: getToday(),
    type: 'expense',
    customCategory: '',
};

function TransactionForm({ initialValues, onSubmit, onCancel }) { // Accept onCancel
    const [form, setForm] = useState(initialValues || initialState);
    const { addTransaction } = useContext(TransactionContext);

    useEffect(() => {
        if (initialValues) setForm(initialValues);
    }, [initialValues]);

    const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const showCustom = form.category === 'Other';

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = e => {
        setForm({ ...form, category: e.target.value, customCategory: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const category = showCustom ? form.customCategory : form.category;
        if (!form.title || !form.amount || !category || !form.date) return;
        if (onSubmit) {
            await onSubmit({ ...form, category, amount: parseFloat(form.amount) });
        } else {
            await addTransaction({ ...form, category, amount: parseFloat(form.amount) });
            setForm({ ...initialState, date: getToday() });
        }
    };

    return (
        <form className="transaction-form" onSubmit={handleSubmit} autoComplete="off">
            <select name="type" value={form.type} onChange={handleChange} autoComplete="off">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>
            <select name="category" value={form.category} onChange={handleCategoryChange} required autoComplete="off">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {showCustom && (
                <input name="customCategory" placeholder="Custom Category" value={form.customCategory} onChange={handleChange} required autoComplete="off" />
            )}
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required autoComplete="off" />
            <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required min="0.01" step="0.01" autoComplete="off" />
            <input name="date" type="date" value={form.date} onChange={handleChange} required autoComplete="off" />

            {initialValues ? (
                <div className="buttons-container">
                    <button className="primary-btn" type="submit">Update</button>
                    {onCancel && <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>}
                </div>
            ) : (
                <button className="primary-btn" type="submit">Add</button>
            )}
        </form>
    );
}

export default TransactionForm;