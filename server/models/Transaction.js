const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    description: { type: String },
    merchant: { type: String },
    // Bill upload fields
    billFile: {
        fileId: { type: String }, // GridFS file ID
        filename: { type: String },
        fileType: { type: String, enum: ['pdf', 'jpg'] }
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema); 