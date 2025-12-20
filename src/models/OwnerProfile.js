const mongoose = require('mongoose');

const ownerProfileSchema = new mongoose.Schema({
    name: { type: String, default: "Unknown" },
    photo: { type: String },
    phone: { type: String },
    instagram: { type: String },
    description: { type: String, default: "Travel Consultant / Founder of Aaliya Trip Planners" }
}, { timestamps: true });

module.exports = mongoose.model('OwnerProfile', ownerProfileSchema);
