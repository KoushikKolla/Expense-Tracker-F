require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name'; // Update this if needed

async function updateTransactionsGroup() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const users = await User.find({ group: { $exists: true, $ne: null } });
    let updatedCount = 0;
    for (const user of users) {
        const result = await Transaction.updateMany(
            { user: user._id, $or: [{ group: { $exists: false } }, { group: null }] },
            { $set: { group: user.group } }
        );
        updatedCount += result.modifiedCount || result.nModified || 0;
    }
    console.log('Updated transactions with group:', updatedCount);
    await mongoose.disconnect();
}

updateTransactionsGroup().catch(err => {
    console.error(err);
    process.exit(1);
}); 