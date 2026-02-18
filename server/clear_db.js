const mongoose = require('mongoose');

require('dotenv').config();
const uri = process.env.MONGO_URI;

// Define the clear database function
const clearDatabase = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Drop the entire database
        await mongoose.connection.db.dropDatabase();
        console.log('Database cleared successfully!');

    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed');
        process.exit();
    }
};

// Execute the function
clearDatabase();
