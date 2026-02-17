const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String }, // URL or base64
    isDeleted: { type: Boolean, default: false },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Reference to Group
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 