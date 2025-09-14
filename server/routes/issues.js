const express = require('express');
const Issue = require('../models/Issue');
const { cloudinary } = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Cloudinary storage setup
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'civicpulse',
        allowed_formats: ['jpeg', 'png', 'jpg'] // lowercase!
    }
});

const upload = multer({ storage });

// CREATE ISSUE (protected route)
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, description, lat, lng } = req.body;

        if (!title || !description || !lat || !lng || !req.file) {
            return res.status(400).json({ error: 'Missing required fields: title, description, lat, lng, or image.' });
        }

        const issue = new Issue({
            title,
            description,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            image: req.file.path,
            reporter: req.user.id
        });

        await issue.save();
        res.status(201).json(issue);
    } catch (err) {
        console.error('Issue creation error:', err);
        res.status(500).json({ error: 'Server error while creating issue' });
    }
});

// GET ALL ISSUES
router.get('/', async (req, res) => {
    try {
        const issues = await Issue.find().populate('reporter', 'email username');
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching issues' });
    }
});

// UPDATE ISSUE STATUS (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server error updating issue' });
    }
});

module.exports = router;
