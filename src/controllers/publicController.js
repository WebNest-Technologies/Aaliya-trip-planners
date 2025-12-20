const Package = require('../models/Package');
const Transport = require('../models/Transport');
const Review = require('../models/Review');
const OwnerProfile = require('../models/OwnerProfile');

const getPublicData = async (req, res) => {
    try {
        const packages = await Package.find({ isActive: true });
        const transports = await Transport.find({ isActive: true });
        const reviews = await Review.find({ isVisible: true });

        const ownerProfile = await OwnerProfile.findOne() || {
            name: "Unknown",
            photo: "images/logo.png",
            phone: "+91 85266 30786",
            instagram: "https://www.instagram.com/aaliya_trip_planners",
            description: "Travel Consultant / Founder of Aaliya Trip Planners"
        };

        res.json({
            packages,
            transports,
            reviews,
            ownerProfile
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getPublicData };
