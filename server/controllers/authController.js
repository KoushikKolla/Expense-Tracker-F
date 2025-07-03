const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }], isDeleted: false });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, isDeleted: false });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const update = {};
        if (username) update.username = username;
        if (email) update.email = email;
        if (password) update.password = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const { avatar } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { avatar }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { isDeleted: true });
        res.json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}; 