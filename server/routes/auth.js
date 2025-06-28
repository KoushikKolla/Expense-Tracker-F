const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { signup, login, getUser, updateProfile, updateAvatar, deleteAccount } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', auth, getUser);
router.put('/profile', auth, updateProfile);
router.put('/avatar', auth, updateAvatar);
router.delete('/account', auth, deleteAccount);

module.exports = router; 