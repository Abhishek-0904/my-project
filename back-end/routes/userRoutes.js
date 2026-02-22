const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin, checkMaintenance } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, checkMaintenance, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, checkMaintenance, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.jobTitle = req.body.jobTitle !== undefined ? req.body.jobTitle : user.jobTitle;
            user.location = req.body.location !== undefined ? req.body.location : user.location;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
            user.github = req.body.github !== undefined ? req.body.github : user.github;
            user.website = req.body.website !== undefined ? req.body.website : user.website;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                jobTitle: updatedUser.jobTitle,
                location: updatedUser.location,
                bio: updatedUser.bio,
                linkedin: updatedUser.linkedin,
                github: updatedUser.github,
                website: updatedUser.website,
                token: req.headers.authorization.split(' ')[1] // Return incoming token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user stats for admin
// @route   GET /api/users/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResumes = await require('../models/Resume').countDocuments();

        res.json({
            totalUsers: totalUsers || 0,
            totalResumes: totalResumes || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
