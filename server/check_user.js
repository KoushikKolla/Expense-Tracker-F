require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected successfully to MongoDB Atlas!");
        const emailByClient = 'test123@gmail.com';
        const passwordByClient = 'test123'; // User likely uses this

        const user = await User.findOne({ email: emailByClient });

        if (user) {
            console.log(`User found: ${user.email}`);
            const isMatch = await bcrypt.compare(passwordByClient, user.password);
            console.log(`Does password "${passwordByClient}" match? ${isMatch}`);
            console.log(`Hash length: ${user.password.length}`);
            console.log(`Hash raw: "${user.password}"`);
        } else {
            console.log(`User ${emailByClient} not found.`);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
