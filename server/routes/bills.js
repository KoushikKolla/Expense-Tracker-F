const express = require('express');
const router = express.Router();
const { uploadBill, getUserBills, serveBill, deleteBill } = require('../controllers/billController');
const auth = require('../middleware/auth');
const { upload } = require('../config/upload');

// Upload bill with transaction details
router.post('/upload', auth, upload.single('billFile'), uploadBill);

// Get all bills for authenticated user
router.get('/user', auth, getUserBills);

// Serve bill file
router.get('/file/:fileId', auth, serveBill);

// Delete bill from transaction
router.delete('/:transactionId', auth, deleteBill);

module.exports = router; 