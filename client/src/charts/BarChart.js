import React, { useContext, useRef, useMemo, useState } from 'react';
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

function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

function BarChart({ selectedCategory }) {
    const { transactions } = useContext(TransactionContext);
    const chartRef = useRef();
    const [view, setView] = useState('month'); // 'day', 'week', 'month', 'year'

    // Memoize gradients to prevent tooltip blinking
    const incomeGradient = useMemo(() => (ctx) => {
        const chart = ctx.chart;
        if (!chart) return '#43e97b';
        const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height || 400);
        gradient.addColorStop(0, '#43e97b');
        gradient.addColorStop(1, '#38f9d7');
        return gradient;
    }, []);

    const expenseGradient = useMemo(() => (ctx) => {
        const chart = ctx.chart;
        if (!chart) return '#ff6e7f';
        const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height || 400);
        gradient.addColorStop(0, '#ff6e7f');
        gradient.addColorStop(1, '#bfe9ff');
        return gradient;
    }, []);

    // Use category color if selected, else default gradient
    const expenseBarColor = selectedCategory && CATEGORY_COLORS[selectedCategory]
        ? CATEGORY_COLORS[selectedCategory]
        : expenseGradient;

    // Aggregate data based on view
    let labels = [];
    let incomeData = [];
    let expenseData = [];
    if (view === 'day') {
        // Group by day (YYYY-MM-DD)
        const dayMap = {};
        transactions.forEach(t => {
            const day = new Date(t.date).toLocaleDateString();
            if (!dayMap[day]) dayMap[day] = { income: 0, expense: 0 };
            if (t.type === 'income') dayMap[day].income += t.amount;
            else dayMap[day].expense += t.amount;
        });
        labels = Object.keys(dayMap).sort((a, b) => new Date(a) - new Date(b));
        incomeData = labels.map(day => dayMap[day].income);
        expenseData = labels.map(day => dayMap[day].expense);
    } else if (view === 'week') {
        // Group by week number in each year
        const weekMap = {};
        transactions.forEach(t => {
            const d = new Date(t.date);
            const year = d.getFullYear();
            const week = getWeekNumber(d);
            const key = `${year}-W${week}`;
            if (!weekMap[key]) weekMap[key] = { income: 0, expense: 0 };
            if (t.type === 'income') weekMap[key].income += t.amount;
            else weekMap[key].expense += t.amount;
        });
        labels = Object.keys(weekMap).sort();
        incomeData = labels.map(w => weekMap[w].income);
        expenseData = labels.map(w => weekMap[w].expense);
    } else if (view === 'year') {
        // Group by year
        const yearMap = {};
        transactions.forEach(t => {
            const year = new Date(t.date).getFullYear();
            if (!yearMap[year]) yearMap[year] = { income: 0, expense: 0 };
            if (t.type === 'income') yearMap[year].income += t.amount;
            else yearMap[year].expense += t.amount;
        });
        labels = Object.keys(yearMap).sort();
        incomeData = labels.map(y => yearMap[y].income);
        expenseData = labels.map(y => yearMap[y].expense);
    } else {
        // Default: month
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
        labels = months;
        incomeData = incomeByMonth;
        expenseData = expenseByMonth;
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: incomeGradient,
                borderRadius: 10,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
                hoverBackgroundColor: '#388e3c',
            },
            {
                label: 'Expense',
                data: expenseData,
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
        maintainAspectRatio: false,
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
        <div style={{ width: '100%', maxWidth: 700, minHeight: 380, background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ textAlign: 'center', margin: 0 }}>Income vs Expense</h4>
                <select value={view} onChange={e => setView(e.target.value)} style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, padding: '4px 10px' }}>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <div style={{ width: '100%', height: 320 }}>
                <Bar ref={chartRef} data={data} options={options} />
            </div>
        </div>
    );
}

export default BarChart; 