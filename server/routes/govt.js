// server/routes/govt.js
const express = require('express');
const GovernmentInfra = require('../models/GovernmentInfra');
const { cloudinary } = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'govt-infra',
        allowed_formats: ['jpeg', 'png', 'jpg']
    }
});

const upload = multer({ storage });

// Add new infrastructure (protected for government users)
router.post('/infra/add', authMiddleware, upload.array('images', 10), async (req, res) => {
    if (req.user.role !== 'govt') {
        return res.status(403).json({ error: 'Access denied.' });
    }
    try {
        const { title, description, lat, lng, status } = req.body;
        const images = req.files.map(file => file.path); 

        const newInfra = new GovernmentInfra({
            title,
            description,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            images,
            status,
            addedBy: req.user.id
        });

        await newInfra.save();
        res.status(201).json(newInfra);
    } catch (err) {
        console.error('Infrastructure creation error:', err);
        res.status(500).json({ error: 'Server error while adding infrastructure' });
    }
});

// Get all government infrastructure
router.get('/infra/all', async (req, res) => {
    try {
        const infra = await GovernmentInfra.find().populate('addedBy', 'email username');
        res.json(infra);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching infrastructure' });
    }
});

module.exports = router;