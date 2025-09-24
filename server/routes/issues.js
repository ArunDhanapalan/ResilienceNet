const express = require('express');
const Issue = require('../models/Issue');
const { cloudinary } = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { default: axios } = require('axios');

const router = express.Router();

// Cloudinary storage setup
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'civicpulse',
        allowed_formats: ['jpeg', 'png', 'jpg']
    }
});

const upload = multer({ storage });

router.post('/create', authMiddleware, upload.array('images', 10), async (req, res) => {
    try {
        const { title, description, lat, lng, area, category, priority } = req.body;

        // req.files will be an array of files
        const images = req.files ? req.files.map(file => file.path) : []; 

        if (!title || !description || !lat || !lng) {
            return res.status(400).json({ error: 'Missing required fields: title, description, lat, lng.' });
        }

        const issue = new Issue({
            title,
            description,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            images: images,
            area: area || "Unknown Area",
            category: category || "Other",
            priority: priority || "Medium",
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

// GET ALL ISSUES FOR GOVERNMENT (with more details)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        if (req.data.user.role !== 'govt') {
            return res.status(403).json({ error: 'Access denied. Government role required.' });
        }
        const issues = await Issue.find().populate('reporter', 'email username');
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching issues' });
    }
});

// GET SINGLE ISSUE DETAILS
router.get('/:id', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id).populate('reporter', 'email username');
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching issue' });
    }
});

// UPDATE ISSUE STATUS (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { status, assignedDepartment, estimatedResolutionTime, resolutionNotes, priority } = req.body;
        const updateData = { status };
        
        if (assignedDepartment) updateData.assignedDepartment = assignedDepartment;
        if (estimatedResolutionTime) updateData.estimatedResolutionTime = estimatedResolutionTime;
        if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
        if (priority) updateData.priority = priority;
        
        const issue = await Issue.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server error updating issue' });
    }
});

// GET ISSUES BY CATEGORY
router.get('/category/:category', async (req, res) => {
    try {
        const issues = await Issue.find({ category: req.params.category }).populate('reporter', 'email username');
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching issues by category' });
    }
});

// GET ISSUES BY STATUS
router.get('/status/:status', async (req, res) => {
    try {
        const issues = await Issue.find({ status: req.params.status }).populate('reporter', 'email username');
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching issues by status' });
    }
});


// const Issue = require("../models/Issue"); // adjust path if needed
const User = require("../models/User")


router.post("/verify-issue", async (req, res) => {
  try {
    const { before, after, issueId } = req.body;

    if (!before || !after || !issueId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Step 1: Call the verification webhook
    const { data: verificationData } = await axios.post(
      "https://adhithya200503.app.n8n.cloud/webhook/8a9f57f9-cbcd-4881-968e-c67068134f1d",
      { before, after }
    );

    // Step 2: If verification is resolved → fetch issue and reporter, send email
    if (verificationData.resolved) {
      const issue = await Issue.findById(issueId);
      if (!issue) {
        return res.status(404).json({ error: "Issue not found." });
      }

      const reporter = await User.findById(issue.reporter).select("email username");

      const emailPayload = {
        issueId: issue._id,
        title: issue.title,
        description: issue.description,
        reporterEmail: reporter?.email,
        reporterUsername: reporter?.username,
        status: "Resolved",
        beforeImage: before,
        afterImage: after,
      };

      const { data: emailResponse } = await axios.post(
        "https://adhithya200503.app.n8n.cloud/webhook/cd0bb85d-5eca-4fd0-8fa5-5c1f6b85d2d0",
        emailPayload
      );

      // Optional: update issue status in DB
      issue.status = "Resolved";
      await issue.save();

      return res.json({
        verification: verificationData,
        email: emailResponse,
      });
    }

    // If verification failed, just return the verification data
    res.json({ verification: verificationData });
  } catch (err) {
    console.error("Verification/email failed:", err);
    res.status(500).json({ error: "Verification/email failed." });
  }
});


module.exports = router;