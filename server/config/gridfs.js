const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

// Initialize GridFS bucket
const initGridFS = () => {
    const db = mongoose.connection.db;
    bucket = new GridFSBucket(db, { bucketName: 'bills' });
};

// Get GridFS bucket
const getBucket = () => {
    if (!bucket) {
        initGridFS();
    }
    return bucket;
};

// Upload file to GridFS
const uploadFile = async (file, metadata = {}) => {
    try {
        if (!file || !file.buffer) {
            throw new Error('No file or file buffer provided');
        }

        const bucket = getBucket();
        const uploadStream = bucket.openUploadStream(file.originalname, {
            metadata: {
                ...metadata,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            }
        });

        return new Promise((resolve, reject) => {
            // Write the buffer directly to the upload stream
            uploadStream.write(file.buffer);
            uploadStream.end();

            uploadStream.on('finish', () => {
                resolve({
                    fileId: uploadStream.id,
                    filename: uploadStream.filename
                });
            });

            uploadStream.on('error', (error) => {
                console.error('GridFS upload error:', error);
                reject(new Error(`Failed to upload file: ${error.message}`));
            });
        });
    } catch (error) {
        console.error('Upload file error:', error);
        throw error;
    }
};

// Download file from GridFS
const downloadFile = async (fileId) => {
    const bucket = getBucket();
    return bucket.openDownloadStream(fileId);
};

// Delete file from GridFS
const deleteFile = async (fileId) => {
    const bucket = getBucket();
    return bucket.delete(fileId);
};

// Get file info from GridFS
const getFileInfo = async (fileId) => {
    const bucket = getBucket();
    const files = bucket.find({ _id: fileId });
    const fileArray = await files.toArray();
    return fileArray[0] || null;
};

module.exports = {
    initGridFS,
    getBucket,
    uploadFile,
    downloadFile,
    deleteFile,
    getFileInfo
}; 