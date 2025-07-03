const Transaction = require('../models/Transaction');
const { uploadFile, downloadFile, deleteFile, getFileInfo } = require('../config/gridfs');

// Upload bill with transaction details
const uploadBill = async (req, res) => {
    try {
        console.log('Bill upload request received:', {
            body: req.body,
            file: req.file ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                hasBuffer: !!req.file.buffer
            } : null,
            user: req.user.id
        });

        const { title, amount, category, date, type, description, merchant } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!title || !amount || !category || !date || !type || !description || !merchant) {
            return res.status(400).json({
                message: 'All fields are required: title, amount, category, date, type, description, merchant'
            });
        }

        // Validate file upload
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a bill file (PDF or JPG)' });
        }

        // Validate amount
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({ message: 'Please enter a valid amount' });
        }

        // Validate type
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'Type must be either income or expense' });
        }

        // Upload file to GridFS
        const fileResult = await uploadFile(req.file, {
            userId: userId,
            title: title,
            category: category,
            type: type
        });

        console.log('File uploaded to GridFS successfully:', fileResult);

        // Determine file type
        const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'jpg';

        // Create transaction with bill file
        const transaction = new Transaction({
            user: userId,
            title,
            amount: numAmount,
            category,
            date: new Date(date),
            type,
            description,
            merchant,
            billFile: {
                fileId: fileResult.fileId.toString(),
                filename: req.file.originalname,
                fileType
            }
        });

        await transaction.save();

        console.log('Transaction saved successfully:', transaction._id);

        res.status(201).json({
            message: 'Bill uploaded successfully',
            transaction: {
                id: transaction._id,
                title: transaction.title,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
                type: transaction.type,
                description: transaction.description,
                merchant: transaction.merchant,
                billFile: transaction.billFile
            }
        });

    } catch (error) {
        console.error('Bill upload error:', error);
        res.status(500).json({ message: 'Error uploading bill', error: error.message });
    }
};

// Get all bills for a user
const getUserBills = async (req, res) => {
    try {
        const userId = req.user.id;
        const bills = await Transaction.find({
            user: userId,
            billFile: { $exists: true, $ne: null }
        }).sort({ date: -1 });

        res.json(bills);
    } catch (error) {
        console.error('Get bills error:', error);
        res.status(500).json({ message: 'Error fetching bills', error: error.message });
    }
};

// Serve bill file
const serveBill = async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.id;

        // Find transaction to verify ownership
        const transaction = await Transaction.findOne({
            'billFile.fileId': fileId,
            user: userId
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Get file info
        const fileInfo = await getFileInfo(fileId);
        if (!fileInfo) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Set headers
        res.setHeader('Content-Type', fileInfo.metadata.mimetype);
        res.setHeader('Content-Disposition', `inline; filename="${fileInfo.metadata.originalName}"`);

        // Stream file
        const downloadStream = downloadFile(fileId);
        downloadStream.pipe(res);

    } catch (error) {
        console.error('Serve bill error:', error);
        res.status(500).json({ message: 'Error serving bill', error: error.message });
    }
};

// Delete bill file from transaction
const deleteBill = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const userId = req.user.id;

        const transaction = await Transaction.findOne({ _id: transactionId, user: userId });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (!transaction.billFile) {
            return res.status(404).json({ message: 'No bill file found for this transaction' });
        }

        // Delete file from GridFS
        if (transaction.billFile.fileId) {
            await deleteFile(transaction.billFile.fileId);
        }

        // Remove bill file from transaction
        transaction.billFile = undefined;
        await transaction.save();

        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error('Delete bill error:', error);
        res.status(500).json({ message: 'Error deleting bill', error: error.message });
    }
};

module.exports = {
    uploadBill,
    getUserBills,
    serveBill,
    deleteBill
}; 