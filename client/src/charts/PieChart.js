import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function PieChart({ transactions: propTransactions }) {
    const { transactions: contextTransactions } = useContext(TransactionContext);
    const { darkMode } = useContext(DarkModeContext);
    const transactions = propTransactions || contextTransactions;
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    expenses.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1', '#c2185b', '#ffa000', '#388e3c', '#455a64'
                ],
                borderWidth: 2,
                borderColor: darkMode ? '#23272f' : '#fff',
                hoverOffset: 16,
                hoverBorderColor: '#fff',
                hoverBorderWidth: 3,
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: darkMode ? '#eee' : '#222',
                    font: { family: 'Inter, Roboto, sans-serif', size: 14, weight: 'bold' },
                    boxWidth: 18,
                    padding: 18,
                },
            },
            tooltip: {
                backgroundColor: darkMode ? '#23272f' : '#fff',
                titleColor: darkMode ? '#fff' : '#222',
                bodyColor: darkMode ? '#fff' : '#222',
                borderColor: '#1976d2',
                borderWidth: 2,
                cornerRadius: 10,
                padding: 14,
                titleFont: { family: 'Inter, Roboto, sans-serif', size: 16, weight: 'bold' },
                bodyFont: { family: 'Inter, Roboto, sans-serif', size: 15 },
                boxPadding: 8,
                displayColors: true,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 8,
                shadowColor: 'rgba(0,0,0,0.2)',
            },
        },
        animation: {
            duration: 1500,
            easing: 'easeOutElastic',
        },
    };
    return (
        <div style={{
            maxWidth: 400,
            background: darkMode
                ? 'linear-gradient(135deg, #23272f 60%, #2d323c 100%)'
                : 'linear-gradient(135deg, #fff 60%, #f5f7fa 100%)',
            borderRadius: 18,
            boxShadow: darkMode
                ? '0 4px 32px rgba(0,0,0,0.32)'
                : '0 4px 24px rgba(0,0,0,0.10)',
            border: darkMode ? '1.5px solid #333' : '1.5px solid #eee',
            padding: 28,
            fontFamily: 'Inter, Roboto, sans-serif',
        }}>
            <h4 style={{ textAlign: 'center', marginBottom: 18, color: darkMode ? '#fff' : '#222', fontWeight: 700, letterSpacing: 0.5 }}>Expenses by Category</h4>
            <Pie data={data} options={options} />
        </div>
    );
}

export default PieChart; 