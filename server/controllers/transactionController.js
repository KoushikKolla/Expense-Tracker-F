const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
    try {
        const { title, amount, category, date, type } = req.body;
        const transaction = new Transaction({
            user: req.user.id,
            title,
            amount,
            category,
            date,
            type,
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, search, sortBy, sortOrder } = req.query;
        let filter = { user: req.user.id };
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.date = -1;
        }
        const transactions = await Transaction.find(filter).sort(sort);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}; 