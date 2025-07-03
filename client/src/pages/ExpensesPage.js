import React, { useEffect, useContext, useState } from 'react';
import { TransactionProvider, TransactionContext } from '../context/TransactionContext';
import TransactionList from '../components/TransactionList';
import Filters from '../components/Filters';
import PieChart from '../charts/PieChart';
import Histogram from '../charts/Histogram';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthContext } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';

function ExpensesContent() {
    const { fetchTransactions, transactions, updateTransaction } = useContext(TransactionContext);
    const { user } = useContext(AuthContext);
    const [filteredExpenses, setFilteredExpenses] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [editTransaction, setEditTransaction] = useState(null);
    useEffect(() => { fetchTransactions({ type: 'expense' }); }, []);
    const expenses = transactions.filter(t => t.type === 'expense');
    const shownExpenses = filteredExpenses || expenses;

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const iconUrl = 'https://img.icons8.com/color/48/000000/rupee.png';
        const imgSize = 18;
        const appUrl = 'https://your-app-url.com'; // Replace with your deployed app URL
        const exportDate = new Date().toLocaleString();
        // Calculate total expenses
        const total = shownExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
        // User info
        const userName = user?.username || 'User';
        const userEmail = user?.email || '';
        // Date range
        let minDate = '', maxDate = '';
        if (shownExpenses.length > 0) {
            const dates = shownExpenses.map(e => new Date(e.date));
            minDate = new Date(Math.min(...dates)).toLocaleDateString();
            maxDate = new Date(Math.max(...dates)).toLocaleDateString();
        }
        // Category summary
        const categorySummary = {};
        shownExpenses.forEach(exp => {
            if (!categorySummary[exp.category]) categorySummary[exp.category] = 0;
            categorySummary[exp.category] += parseFloat(exp.amount) || 0;
        });
        const summaryRows = Object.entries(categorySummary).map(([cat, amt]) => [cat, amt.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })]);
        // Load image as base64 and then add to PDF
        const img = new window.Image();
        img.crossOrigin = '';
        img.src = iconUrl;
        img.onload = function () {
            // Subtle background
            doc.setFillColor(245, 247, 250);
            doc.rect(0, 0, 210, 297, 'F');
            // App icon
            doc.addImage(img, 'PNG', 95, 10, imgSize, imgSize);
            // App name
            doc.setFontSize(20);
            doc.setTextColor('#1976d2');
            doc.setFont('helvetica', 'bold');
            doc.text('Smart Expense Tracker', 105, 28, { align: 'center' });
            // User info
            doc.setFontSize(12);
            doc.setTextColor('#333');
            doc.setFont('helvetica', 'normal');
            doc.text(`User: ${userName}`, 14, 38);
            if (userEmail) doc.text(`Email: ${userEmail}`, 14, 44);
            // Date range
            if (minDate && maxDate) {
                doc.text(`Date Range: ${minDate} to ${maxDate}`, 14, 50);
            }
            let y = 56;
            // Category summary
            if (summaryRows.length > 0) {
                doc.setFontSize(13);
                doc.setTextColor('#1976d2');
                doc.text('Category Summary', 14, y);
                doc.setFontSize(11);
                doc.setTextColor('#333');
                autoTable(doc, {
                    head: [['Category', 'Total']],
                    body: summaryRows,
                    startY: y + 2,
                    headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold', fontSize: 11 },
                    bodyStyles: { fontSize: 10 },
                    margin: { left: 14, right: 14 },
                    styles: { cellPadding: 2, overflow: 'linebreak', minCellHeight: 8 },
                    tableWidth: 80,
                    theme: 'grid',
                });
                y = doc.lastAutoTable.finalY + 8;
            }
            // Section title
            doc.setFontSize(15);
            doc.setTextColor('#333');
            doc.setFont('helvetica', 'normal');
            doc.text('Expenses', 14, y);
            y += 6;
            // Table
            const tableColumn = ['Date', 'Title', 'Amount', 'Category'];
            const tableRows = shownExpenses.map(exp => [
                new Date(exp.date).toLocaleDateString(),
                exp.title,
                exp.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
                exp.category
            ]);
            // Add summary row
            tableRows.push([
                '',
                { content: 'Total', styles: { fontStyle: 'bold', textColor: [25, 118, 210] } },
                { content: total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), styles: { fontStyle: 'bold', textColor: [25, 118, 210] } },
                ''
            ]);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: y,
                headStyles: {
                    fillColor: [25, 118, 210],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 12,
                    lineWidth: 0.5,
                    lineColor: [25, 118, 210],
                },
                bodyStyles: {
                    fontSize: 11,
                    halign: 'center',
                    valign: 'middle',
                    lineWidth: 0.2,
                    lineColor: [200, 200, 200],
                },
                alternateRowStyles: {
                    fillColor: [235, 240, 250],
                },
                margin: { left: 10, right: 10 },
                styles: {
                    cellPadding: 4,
                    overflow: 'linebreak',
                    minCellHeight: 10,
                },
                didDrawPage: function (data) {
                    // Footer
                    // Page number
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(10);
                    doc.setTextColor('#888');
                    doc.text(`Exported: ${exportDate}`, 10, 290);
                    doc.textWithLink(appUrl, 150, 290, { url: appUrl });
                    doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, 105, 290, { align: 'center' });
                    // Custom footer
                    doc.setFontSize(11);
                    doc.setTextColor('#1976d2');
                    doc.text('Thank you for using Smart Expense Tracker!', 105, 282, { align: 'center' });
                    // Signature/Stamp
                    doc.setFontSize(13);
                    doc.setTextColor('#388e3c');
                    doc.text('✔ Verified by Smart Expense Tracker', 105, 275, { align: 'center' });
                },
            });
            doc.save('expenses.pdf');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 10000);
        };
        img.onerror = function () {
            doc.setFillColor(245, 247, 250);
            doc.rect(0, 0, 210, 297, 'F');
            doc.setFontSize(20);
            doc.setTextColor('#1976d2');
            doc.setFont('helvetica', 'bold');
            doc.text('Smart Expense Tracker', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.setTextColor('#333');
            doc.setFont('helvetica', 'normal');
            doc.text(`User: ${userName}`, 14, 30);
            if (userEmail) doc.text(`Email: ${userEmail}`, 14, 36);
            if (minDate && maxDate) {
                doc.text(`Date Range: ${minDate} to ${maxDate}`, 14, 42);
            }
            let y = 48;
            if (summaryRows.length > 0) {
                doc.setFontSize(13);
                doc.setTextColor('#1976d2');
                doc.text('Category Summary', 14, y);
                doc.setFontSize(11);
                doc.setTextColor('#333');
                autoTable(doc, {
                    head: [['Category', 'Total']],
                    body: summaryRows,
                    startY: y + 2,
                    headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold', fontSize: 11 },
                    bodyStyles: { fontSize: 10 },
                    margin: { left: 14, right: 14 },
                    styles: { cellPadding: 2, overflow: 'linebreak', minCellHeight: 8 },
                    tableWidth: 80,
                    theme: 'grid',
                });
                y = doc.lastAutoTable.finalY + 8;
            }
            doc.setFontSize(15);
            doc.setTextColor('#333');
            doc.setFont('helvetica', 'normal');
            doc.text('Expenses', 14, y);
            y += 6;
            const tableColumn = ['Date', 'Title', 'Amount', 'Category'];
            const tableRows = shownExpenses.map(exp => [
                new Date(exp.date).toLocaleDateString(),
                exp.title,
                exp.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
                exp.category
            ]);
            tableRows.push([
                '',
                { content: 'Total', styles: { fontStyle: 'bold', textColor: [25, 118, 210] } },
                { content: total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), styles: { fontStyle: 'bold', textColor: [25, 118, 210] } },
                ''
            ]);
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: y,
                headStyles: {
                    fillColor: [25, 118, 210],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 12,
                    lineWidth: 0.5,
                    lineColor: [25, 118, 210],
                },
                bodyStyles: {
                    fontSize: 11,
                    halign: 'center',
                    valign: 'middle',
                    lineWidth: 0.2,
                    lineColor: [200, 200, 200],
                },
                alternateRowStyles: {
                    fillColor: [235, 240, 250],
                },
                margin: { left: 10, right: 10 },
                styles: {
                    cellPadding: 4,
                    overflow: 'linebreak',
                    minCellHeight: 10,
                },
                didDrawPage: function (data) {
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(10);
                    doc.setTextColor('#888');
                    doc.text(`Exported: ${exportDate}`, 10, 290);
                    doc.textWithLink(appUrl, 150, 290, { url: appUrl });
                    doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, 105, 290, { align: 'center' });
                    doc.setFontSize(11);
                    doc.setTextColor('#1976d2');
                    doc.text('Thank you for using Smart Expense Tracker!', 105, 282, { align: 'center' });
                    doc.setFontSize(13);
                    doc.setTextColor('#388e3c');
                    doc.text('✔ Verified by Smart Expense Tracker', 105, 275, { align: 'center' });
                },
            });
            doc.save('expenses.pdf');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 10000);
        };
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

    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
    };

    const handleUpdate = async (updated) => {
        await updateTransaction(editTransaction._id, updated);
        setEditTransaction(null);
    };

    return (
        <div className="expenses-page" style={{ paddingLeft: 32, paddingRight: 32 }}>
            {showToast && (
                <div style={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    background: 'linear-gradient(90deg, #43e97b 60%, #38f9d7 100%)',
                    color: '#222',
                    fontWeight: 700,
                    fontSize: 16,
                    borderRadius: 10,
                    boxShadow: '0 2px 12px rgba(30,60,90,0.12)',
                    padding: '16px 32px',
                    zIndex: 9999,
                    letterSpacing: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    animation: 'fadeIn 0.3s',
                }}>
                    <img src="https://img.icons8.com/color/48/000000/rupee.png" alt="pdf" style={{ width: 24, height: 24 }} />
                    PDF Generated
                </div>
            )}
            <h2>All Expenses</h2>
            <Filters onFilter={handleFilter} />
            <div className="charts-grid" style={{ marginBottom: '2rem' }}>
                <PieChart transactions={shownExpenses} />
                <Histogram transactions={shownExpenses} selectedCategory={selectedCategory} />
            </div>
            <button onClick={handleExportPDF} style={{ marginBottom: '1.5rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6rem 1.3rem', fontWeight: 600, cursor: 'pointer' }}>
                Export to PDF
            </button>
            {editTransaction && (
                <div className="modal-overlay" onClick={() => setEditTransaction(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Edit Transaction</h3>
                        <TransactionForm initialValues={editTransaction} onSubmit={handleUpdate} />
                        <button className="cancel-btn" onClick={() => setEditTransaction(null)}>Cancel</button>
                    </div>
                </div>
            )}
            <TransactionList transactions={shownExpenses} onEdit={handleEdit} />
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: none; } }
            `}</style>
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