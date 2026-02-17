import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async (params = {}) => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        setTransactions(res.data);
    };

    const addTransaction = async (data) => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/expenses`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(prev => [res.data, ...prev]);
    };

    const updateTransaction = async (id, data) => {
        console.log('updateTransaction called with id:', id, 'data:', data);
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/expenses/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(prev => prev.map(t => t._id === id ? res.data : t));
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error('An error occurred while updating the transaction.');
            }
        }
    };

    const deleteTransaction = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(prev => prev.filter(t => t._id !== id));
    };

    return (
        <TransactionContext.Provider value={{ transactions, fetchTransactions, addTransaction, updateTransaction, deleteTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}; 