import React, { useEffect, useContext, useState } from 'react';
import { TransactionProvider, TransactionContext } from '../context/TransactionContext';
import TransactionList from '../components/TransactionList';
import Filters from '../components/Filters';
import PieChart from '../charts/PieChart';
import Histogram from '../charts/Histogram';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ExpensesContent() {
    const { fetchTransactions, transactions } = useContext(TransactionContext);
    const [filteredExpenses, setFilteredExpenses] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    useEffect(() => { fetchTransactions({ type: 'expense' }); }, []);
    const expenses = transactions.filter(t => t.type === 'expense');
    const shownExpenses = filteredExpenses || expenses;

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Expenses', 14, 16);
        const tableColumn = ['Date', 'Title', 'Amount', 'Category'];
        const tableRows = shownExpenses.map(exp => [
            new Date(exp.date).toLocaleDateString(),
            exp.title,
            exp.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
            exp.category
        ]);
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 22 });
        doc.save('expenses.pdf');
    };

    // Filtering logic for client-side filtering
    const handleFilter = params => {
        let filtered = expenses;
        if (params.type) filtered = filtered.filter(t => t.type === params.type);
        if (params.category) filtered = filtered.filter(t => t.category === params.category);
        if (params.startDate) filtered = filtered.filter(t => new Date(t.date) >= new Date(params.startDate));
        if (params.endDate) filtered = filtered.filter(t => new Date(t.date) <= new Date(params.endDate));
        if (params.search) filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(params.search.toLowerCase()) ||
            (t.category && t.category.toLowerCase().includes(params.search.toLowerCase()))
        );
        setFilteredExpenses(filtered);
        setSelectedCategory(params.category || '');
    };

    return (
        <div className="expenses-page" style={{ paddingLeft: 32, paddingRight: 32 }}>
            <h2>All Expenses</h2>
            <Filters onFilter={handleFilter} />
            <div className="charts-grid" style={{ marginBottom: '2rem' }}>
                <PieChart transactions={shownExpenses} />
                <Histogram transactions={shownExpenses} selectedCategory={selectedCategory} />
            </div>
            <button onClick={handleExportPDF} style={{ marginBottom: '1.5rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6rem 1.3rem', fontWeight: 600, cursor: 'pointer' }}>
                Export to PDF
            </button>
            <TransactionList transactions={shownExpenses} />
        </div>
    );
}

function ExpensesPage() {
    return (
        <TransactionProvider>
            <ExpensesContent />
        </TransactionProvider>
    );
}

export default ExpensesPage; 