const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name'; // Update this if needed

async function updateCreatedBy() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const result = await Transaction.updateMany(
        { $or: [{ createdBy: { $exists: false } }, { createdBy: null }] },
        [
            { $set: { createdBy: "$user" } }
        ]
    );
    console.log('Updated transactions with createdBy:', result.modifiedCount || result.nModified || 0);
    await mongoose.disconnect();
}

updateCreatedBy().catch(err => {
    console.error(err);
    process.exit(1);
}); 