const mongoose = require('mongoose');

require('dotenv').config();
const uri = process.env.MONGO_URI;

// Schema Definitions (Minimal required to connect and delete)
// We define them here or use `mongoose.model` if they are already registered
// But here we can use `mongoose.connection.collection(name).deleteMany({})`

const clearCollections = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // List of collections to clear
        const collections = ['users', 'transactions', 'groups'];

        for (const colName of collections) {
            try {
                // Drop if exists, or deleteMany
                const model = mongoose.connection.collection(colName);
                if (model) {
                    await model.deleteMany({});
                    console.log(`Cleared collection: ${colName}`);
                }
            } catch (err) {
                console.log(`Could not clear collection ${colName}, maybe it doesn't exist:`, err.message);
            }
        }

        // Also clear GridFS chunks/files if any exist (fs.files, fs.chunks)
        try {
            const files = mongoose.connection.collection('fs.files');
            if (files) await files.deleteMany({});
            const chunks = mongoose.connection.collection('fs.chunks');
            if (chunks) await chunks.deleteMany({});
            console.log('Cleared GridFS files and chunks');
        } catch (e) {
            console.log('GridFS collections not found or error clearing:', e.message);
        }

        console.log('All specified collections cleared successfully!');

    } catch (error) {
        console.error('Error clearing collections:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed');
        process.exit();
    }
};

// Execute the function
clearCollections();
