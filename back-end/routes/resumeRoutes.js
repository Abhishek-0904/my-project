const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { protect, checkMaintenance } = require('../middleware/authMiddleware');

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
// @access  Private
router.get('/', protect, checkMaintenance, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).sort({ lastModified: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
router.post('/', protect, checkMaintenance, async (req, res) => {
    try {
        const { title, template, data } = req.body;
        const resume = new Resume({
            user: req.user._id,
            title,
            template,
            data
        });

        const createdResume = await resume.save();
        res.status(201).json(createdResume);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
router.put('/:id', protect, checkMaintenance, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            if (resume.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this resume' });
            }

            resume.title = req.body.title || resume.title;
            resume.template = req.body.template || resume.template;
            resume.data = req.body.data || resume.data;
            resume.lastModified = Date.now();

            const updatedResume = await resume.save();
            res.json(updatedResume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
router.delete('/:id', protect, checkMaintenance, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (resume) {
            if (resume.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this resume' });
            }

            await resume.deleteOne();
            res.json({ message: 'Resume deleted' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get a public resume by ID
// @route   GET /api/resumes/public/:id
// @access  Public
router.get('/public/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume) {
            res.json({
                template: resume.template,
                data: resume.data,
                gradient: resume.gradient
            });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
