const multer = require('multer');

// Configure multer for memory storage (for GridFS)
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and JPG files are allowed!'), false);
        }
    }
});

module.exports = { upload }; 