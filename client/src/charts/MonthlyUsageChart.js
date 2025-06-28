import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function MonthlyUsageChart() {
    const { transactions } = useContext(TransactionContext);
    const { darkMode } = useContext(DarkModeContext);
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const expenseByMonth = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    transactions.forEach(t => {
        const date = new Date(t.date);
        if (t.type === 'expense' && date.getFullYear() === currentYear) {
            const month = date.getMonth();
            expenseByMonth[month] += t.amount;
        }
    });
    const data = {
        labels: months,
        datasets: [
            {
                label: 'Expenses',
                data: expenseByMonth,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, '#ff6e7f');
                    gradient.addColorStop(1, '#bfe9ff');
                    return gradient;
                },
                borderRadius: 12,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
                hoverBackgroundColor: '#1976d2',
                borderWidth: 2,
                borderColor: darkMode ? '#23272f' : '#fff',
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: darkMode ? '#23272f' : '#fff',
                titleColor: darkMode ? '#fff' : '#222',
                bodyColor: darkMode ? '#fff' : '#222',
                borderColor: '#ff6e7f',
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
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: darkMode ? '#eee' : '#444', font: { weight: 'bold', family: 'Inter, Roboto, sans-serif' } },
            },
            y: {
                grid: { color: darkMode ? '#333' : '#eee' },
                ticks: {
                    color: darkMode ? '#eee' : '#444',
                    font: { family: 'Inter, Roboto, sans-serif' },
                    callback: (v) => `₹${v}`,
                },
            },
        },
    };
    return (
        <div style={{
            maxWidth: 700,
            width: '100%',
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
            <h4 style={{ textAlign: 'center', marginBottom: 18, color: darkMode ? '#fff' : '#222', fontWeight: 700, letterSpacing: 0.5 }}>Monthly Usage</h4>
            <Bar data={data} options={options} height={320} />
        </div>
    );
}

export default MonthlyUsageChart; 