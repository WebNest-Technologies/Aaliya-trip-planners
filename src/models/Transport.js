const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerKm: { type: Number, required: true, default: 0 },
    dailyRent: { type: Number, default: 0 },
    acCharges: { type: Number, default: 0 },
    hillsCharges: { type: Number, default: 0 },
    additionalInfo: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);
