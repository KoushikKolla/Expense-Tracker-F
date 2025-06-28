import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../components/Filters';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CATEGORY_COLORS = {
    Transportation: '#1976d2',
    Food: '#43e97b',
    Utilities: '#ffb300',
    Health: '#e53935',
    Entertainment: '#8e24aa',
    Shopping: '#f7971e',
    Education: '#388e3c',
    Rent: '#d32f2f',
    Travel: '#00bcd4',
    Other: '#757575',
    Salary: '#388e3c',
    Business: '#1976d2',
    Investment: '#ffb300',
    Gift: '#8e24aa',
};

function BarChart({ selectedCategory }) {
    const { transactions } = useContext(TransactionContext);
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const incomeByMonth = Array(12).fill(0);
    const expenseByMonth = Array(12).fill(0);
    transactions.forEach(t => {
        const month = new Date(t.date).getMonth();
        if (t.type === 'income') incomeByMonth[month] += t.amount;
        else expenseByMonth[month] += t.amount;
    });
    // Use category color if selected, else default gradient
    const expenseBarColor = selectedCategory && CATEGORY_COLORS[selectedCategory]
        ? CATEGORY_COLORS[selectedCategory]
        : (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, '#ff6e7f');
            gradient.addColorStop(1, '#bfe9ff');
            return gradient;
        };
    const data = {
        labels: months,
        datasets: [
            {
                label: 'Income',
                data: incomeByMonth,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, '#43e97b');
                    gradient.addColorStop(1, '#38f9d7');
                    return gradient;
                },
                borderRadius: 10,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
                hoverBackgroundColor: '#388e3c',
            },
            {
                label: 'Expense',
                data: expenseByMonth,
                backgroundColor: expenseBarColor,
                borderRadius: 10,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
                hoverBackgroundColor: expenseBarColor,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#444', font: { weight: 'bold' } },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `₹${ctx.parsed.y.toLocaleString()}`,
                },
                backgroundColor: '#222',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#43e97b',
                borderWidth: 1,
            },
        },
        animation: {
            duration: 1200,
            easing: 'easeOutQuart',
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#444', font: { weight: 'bold' } },
            },
            y: {
                grid: { color: '#eee' },
                ticks: {
                    color: '#444',
                    callback: (v) => `₹${v}`,
                },
            },
        },
    };
    return (
        <div style={{ maxWidth: 600, background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 24 }}>
            <h4 style={{ textAlign: 'center', marginBottom: 16 }}>Monthly Income vs Expense</h4>
            <Bar data={data} options={options} height={300} />
        </div>
    );
}

export default BarChart; 