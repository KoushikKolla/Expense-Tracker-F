import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function LineChart() {
    const { transactions } = useContext(TransactionContext);
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let balance = 0;
    const labels = [];
    const dataPoints = [];
    sorted.forEach(t => {
        if (t.type === 'income') balance += t.amount;
        else balance -= t.amount;
        labels.push(new Date(t.date).toLocaleDateString());
        dataPoints.push(balance);
    });
    const data = {
        labels,
        datasets: [
            {
                label: 'Cumulative Balance',
                data: dataPoints,
                fill: false,
                borderColor: '#1976d2',
                tension: 0.1,
            },
        ],
    };
    return (
        <div style={{ maxWidth: 600 }}>
            <h4>Cumulative Balance Over Time</h4>
            <Line data={data} />
        </div>
    );
}

export default LineChart; 