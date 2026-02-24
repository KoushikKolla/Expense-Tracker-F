const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Group = require('../models/Group');
const JWT_SECRET = process.env.JWT_SECRET || 'expense_tracker_secret_koushik_2026';

exports.signup = async (req, res) => {
    try {
        const { username, password, groupName } = req.body;
        const email = req.body.email?.trim().toLowerCase();
        console.log('Signup attempt:', { username, email, groupName });

        const existingUser = await User.findOne({ $or: [{ email }, { username }], isDeleted: false });
        if (existingUser) {
            console.log('Signup failed: User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        let groupId = null;
        if (groupName && groupName.trim()) {
            let group = await Group.findOne({ groupName: groupName.trim() });
            if (!group) {
                console.log('Creating new group:', groupName);
                group = new Group({ groupName: groupName.trim(), members: [] });
                await group.save();
            }
            groupId = group._id;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            group: groupId
        });
        await user.save();

        if (groupId) {
            await Group.findByIdAndUpdate(groupId, { $push: { members: user._id } });
        }

        console.log('User registered successfully:', user._id);
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, username, email, group: groupId } });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;
        console.log('Login attempt for email:', email);

        const user = await User.findOne({ email, isDeleted: false });
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Password mismatch');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        console.log('Login successful for:', email);
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('group', 'groupName');
        console.log('Fetched user:', user);
        const userObj = user.toObject();
        userObj.groupName = user.group?.groupName || '';
        res.json(userObj);
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