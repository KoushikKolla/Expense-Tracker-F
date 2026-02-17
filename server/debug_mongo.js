const mongoose = require('mongoose');
const uri = "mongodb+srv://expenseuser:iYstoqooKzyw2Tzr@expense-tracker.xj1kurv.mongodb.net/expense-tracker?appName=expense-tracker";

mongoose.connect(uri)
    .then(() => {
        console.log("Connected successfully!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Connection failed!");
        console.error(JSON.stringify(err, null, 2));
        process.exit(1);
    });
