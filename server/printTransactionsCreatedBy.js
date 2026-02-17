const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name'; // Update this if needed

async function printTransactionsCreatedBy() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const transactions = await Transaction.find({})
        .limit(10)
        .populate('createdBy', 'username email');
    for (const t of transactions) {
        console.log({
            _id: t._id,
            title: t.title,
            createdBy: t.createdBy,
            user: t.user,
        });
    }
    await mongoose.disconnect();
}

printTransactionsCreatedBy().catch(err => {
    console.error(err);
    process.exit(1);
}); 