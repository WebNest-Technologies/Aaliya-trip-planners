const cloudinary = require('../src/config/cloudinary');
const path = require('path');

async function verifyCloudinary() {
    console.log('Testing Cloudinary Connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME); // Should verify env loading

    try {
        // Try uploading a simple test string as a file (Cloudinary supports data URI or remote URL, or raw content?)
        // Let's use a remote image for testing to avoid file system dependency, or a tiny base64.
        const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

        const result = await cloudinary.uploader.upload(testImage, {
            folder: 'test_verification'
        });

        console.log('Upload Successful!');
        console.log('Public ID:', result.public_id);
        console.log('URL:', result.secure_url);

        // Clean up
        await cloudinary.uploader.destroy(result.public_id);
        console.log('Cleanup Successful (Verified delete permission)');

    } catch (error) {
        console.error('Cloudinary Verification Failed:', error);
        process.exit(1);
    }
}

verifyCloudinary();
