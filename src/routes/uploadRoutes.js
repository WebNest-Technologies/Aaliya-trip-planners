const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

router.get('/', (req, res) => {
    res.send('Upload Service is Running');
});

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Cloudinary storage automatically puts the file url in req.file.path
        res.json({
            message: 'File uploaded successfully',
            path: req.file.path
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
