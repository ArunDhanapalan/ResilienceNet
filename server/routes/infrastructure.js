const express = require('express');
const Infrastructure = require('../models/Infrastructure');
const { cloudinary } = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Cloudinary storage setup
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'infrastructure',
        allowed_formats: ['jpeg', 'png', 'jpg']
    }
});

const upload = multer({ storage });

// CREATE INFRASTRUCTURE PROJECT
router.post('/create', authMiddleware, upload.array('images', 10), async (req, res) => {
    try {

        const { name, type, description, lat, lng, area, budget, estimatedCompletion, contractor, progress, notes } = req.body;
        const images = req.files ? req.files.map(file => file.path) : [];

        if (!name || !type || !description || !lat || !lng || !area) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const infrastructure = new Infrastructure({
            name,
            type,
            description,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            area,
            budget: budget ? parseFloat(budget) : undefined,
            estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion) : undefined,
            contractor,
            progress: progress ? parseInt(progress) : 0,
            notes,
            images,
            createdBy: req.user.id
        });

        await infrastructure.save();
        res.status(201).json(infrastructure);
    } catch (err) {
        console.error('Infrastructure creation error:', err);
        res.status(500).json({ error: 'Server error while creating infrastructure project' });
    }
});

// GET ALL INFRASTRUCTURE PROJECTS
router.get('/', async (req, res) => {
    try {
        const projects = await Infrastructure.find().populate('createdBy', 'username email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching infrastructure projects' });
    }
});

// GET SINGLE INFRASTRUCTURE PROJECT
router.get('/:id', async (req, res) => {
    try {
        const project = await Infrastructure.findById(req.params.id).populate('createdBy', 'username email');
        if (!project) return res.status(404).json({ error: 'Infrastructure project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching infrastructure project' });
    }
});

// UPDATE INFRASTRUCTURE PROJECT
router.put('/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
    try {
        if (req.user.role !== 'govt') {
            return res.status(403).json({ error: 'Access denied. Government role required.' });
        }

        const { name, type, description, lat, lng, area, budget, estimatedCompletion, contractor, progress, notes, status } = req.body;
        const newImages = req.files ? req.files.map(file => file.path) : [];

        const updateData = {};
        if (name) updateData.name = name;
        if (type) updateData.type = type;
        if (description) updateData.description = description;
        if (lat && lng) updateData.location = { lat: parseFloat(lat), lng: parseFloat(lng) };
        if (area) updateData.area = area;
        if (budget) updateData.budget = parseFloat(budget);
        if (estimatedCompletion) updateData.estimatedCompletion = new Date(estimatedCompletion);
        if (contractor) updateData.contractor = contractor;
        if (progress) updateData.progress = parseInt(progress);
        if (notes) updateData.notes = notes;
        if (status) updateData.status = status;
        if (newImages.length > 0) updateData.images = newImages;

        const project = await Infrastructure.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!project) return res.status(404).json({ error: 'Infrastructure project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Server error updating infrastructure project' });
    }
});

// DELETE INFRASTRUCTURE PROJECT
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'govt') {
            return res.status(403).json({ error: 'Access denied. Government role required.' });
        }

        const project = await Infrastructure.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Infrastructure project not found' });
        res.json({ message: 'Infrastructure project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error deleting infrastructure project' });
    }
});

module.exports = router;
