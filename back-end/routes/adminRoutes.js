const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resume = require('../models/Resume');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get admin reports
// @route   GET /api/admin/reports
// @access  Private/Admin
router.get('/reports', protect, admin, async (req, res) => {
    try {
        // 1. User Growth (last 7 days - count per day)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const usersPerDay = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Resume Template distribution
        const templateStats = await Resume.aggregate([
            {
                $group: {
                    _id: "$template",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 3. System Stats
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const activeUsersLast24h = await User.countDocuments({
            updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        res.json({
            userGrowth: usersPerDay,
            templateStats: templateStats,
            summary: {
                totalUsers,
                totalResumes,
                activeUsersLast24h,
                avgResumesPerUser: totalUsers > 0 ? (totalResumes / totalUsers).toFixed(1) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
