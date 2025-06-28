import React, { useContext, useState } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { DarkModeContext } from '../context/DarkModeContext';
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

const BIN_PRESETS = {
    Default: { bins: [0, 50, 100, 200, 500], labels: ['0-50', '50-100', '100-200', '200-500', '500+'] },
    Fine: { bins: [0, 20, 50, 100, 200, 500], labels: ['0-20', '20-50', '50-100', '100-200', '200-500', '500+'] },
    Coarse: { bins: [0, 100, 500], labels: ['0-100', '100-500', '500+'] },
};

function Histogram({ transactions: propTransactions, selectedCategory }) {
    const { transactions: contextTransactions } = useContext(TransactionContext);
    const { darkMode } = useContext(DarkModeContext);
    const transactions = propTransactions || contextTransactions;
    const expenses = transactions.filter(t => t.type === 'expense');

    const [binPreset, setBinPreset] = useState('Default');
    const { bins, labels: binLabels } = BIN_PRESETS[binPreset];
    const binCounts = Array(binLabels.length).fill(0);
    expenses.forEach(t => {
        let placed = false;
        for (let i = 0; i < bins.length - 1; i++) {
            if (t.amount >= bins[i] && t.amount < bins[i + 1]) {
                binCounts[i]++;
                placed = true;
                break;
            }
        }
        if (!placed && t.amount >= bins[bins.length - 1]) {
            binCounts[binCounts.length - 1]++;
        }
    });
    // Use category color if selected, else default gradient
    const barColor = selectedCategory && CATEGORY_COLORS[selectedCategory]
        ? CATEGORY_COLORS[selectedCategory]
        : (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, '#f7971e');
            gradient.addColorStop(1, '#ffd200');
            return gradient;
        };
    const data = {
        labels: binLabels,
        datasets: [
            {
                label: 'Expense Count',
                data: binCounts,
                backgroundColor: barColor,
                borderRadius: 12,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.6,
                hoverBackgroundColor: barColor,
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
                borderColor: '#f7971e',
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
                },
            },
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
            <div style={{ marginBottom: 12, textAlign: 'center' }}>
                <label style={{ color: darkMode ? '#fff' : '#222', fontWeight: 600, marginRight: 8 }}>Amount Bins:</label>
                <select value={binPreset} onChange={e => setBinPreset(e.target.value)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #bbb' }}>
                    {Object.keys(BIN_PRESETS).map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                    ))}
                </select>
            </div>
            <h4 style={{ textAlign: 'center', marginBottom: 18, color: darkMode ? '#fff' : '#222', fontWeight: 700, letterSpacing: 0.5 }}>Expense Amount Distribution</h4>
            <Bar data={data} options={options} height={250} />
        </div>
    );
}

export default Histogram; 