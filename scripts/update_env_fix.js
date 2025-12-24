const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const credentials = `
CLOUDINARY_CLOUD_NAME=dpoq9cbk5
CLOUDINARY_API_KEY=339818724684276
CLOUDINARY_API_SECRET=vp-LVF3p2R0lo5JX6pK_LaUWI14
`;

try {
    fs.appendFileSync(envPath, credentials);
    console.log('Successfully appended credentials to .env');
} catch (error) {
    console.error('Error updating .env:', error);
}
