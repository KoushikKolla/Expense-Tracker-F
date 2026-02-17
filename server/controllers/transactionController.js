const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.addTransaction = async (req, res) => {
    try {
        const { title, amount, category, date, type } = req.body;
        const user = await User.findById(req.user.id);
        console.log('Adding transaction for user:', req.user.id);
        console.log('User group:', user.group);
        const transaction = new Transaction({
            user: req.user.id,
            title,
            amount,
            category,
            date,
            type,
            group: user.group,
            createdBy: req.user.id
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
        const user = await User.findById(req.user.id);
        console.log('Fetching transactions for group:', user.group);
        let filter = { group: user.group };
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
        const transactions = await Transaction.find(filter).sort(sort).populate('createdBy', 'username email');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log('Update request:', req.params.id, 'User:', user._id);
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: user._id },
            req.body,
            { new: true }
        );
        if (!transaction) {
            console.log('Transaction not found for id/user:', req.params.id, user._id);
            return res.status(403).json({ message: 'You can only update transactions you have created.' });
        }
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