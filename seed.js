const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        await Admin.deleteMany(); // Clear existing admins

        const admin = new Admin({
            name: 'Super Admin',
            email: 'admin@webnest.com',
            phone: '9999999999',
            password: 'admin123' // Will be hashed by pre-save hook
        });

        await admin.save();
        console.log('Admin seeded successfully: admin@webnest.com / admin123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
