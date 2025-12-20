const Package = require('../models/Package');
const Transport = require('../models/Transport');
const Review = require('../models/Review');
const OwnerProfile = require('../models/OwnerProfile');


const createPackage = async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePackage = async (req, res) => {
    try {
        const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: 'Package removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const createTransport = async (req, res) => {
    try {
        const transport = new Transport(req.body);
        const savedTransport = await transport.save();
        res.status(201).json(savedTransport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTransport = async (req, res) => {
    try {
        const updatedTransport = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTransport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTransport = async (req, res) => {
    try {
        await Transport.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transport removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const createReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateOwnerProfile = async (req, res) => {
    try {
        const { name, photo, phone, instagram, description } = req.body;
        
        let profile = await OwnerProfile.findOne();
        if (profile) {
            profile.name = name;
            profile.photo = photo;
            profile.phone = phone;
            profile.instagram = instagram;
            profile.description = description;
            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            const newProfile = new OwnerProfile({ name, photo, phone, instagram, description });
            const savedProfile = await newProfile.save();
            res.json(savedProfile);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const applyOffer = async (req, res) => {
    try {
        const { target, packageIds, offer } = req.body;
        

        let updateQuery = {};
        if (offer) {
            updateQuery = { $set: { offer } };
        } else {
            updateQuery = { $unset: { offer: "" } };
        }

        if (target === 'ALL') {
            await Package.updateMany({}, updateQuery);
        } else if (target === 'SELECTED' && packageIds && packageIds.length > 0) {
            await Package.updateMany({ _id: { $in: packageIds } }, updateQuery);
        } else {
            return res.status(400).json({ message: "Invalid target or no packages selected" });
        }

        res.json({ message: "Offers updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getDashboardData = async (req, res) => {
    try {
        
        const packages = await Package.find({}).sort({ createdAt: -1 });
        const transports = await Transport.find({}).sort({ createdAt: -1 });
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        const ownerProfile = await OwnerProfile.findOne();

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

module.exports = {
    createPackage, updatePackage, deletePackage,
    createTransport, updateTransport, deleteTransport,
    createReview, deleteReview,
    updateOwnerProfile,
    applyOffer,
    getDashboardData
};
