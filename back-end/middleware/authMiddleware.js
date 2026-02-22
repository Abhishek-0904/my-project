const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Settings = require('../models/Settings');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }
            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const checkMaintenance = async (req, res, next) => {
    try {
        const settings = await Settings.findOne();
        if (settings && settings.maintenanceMode) {
            // Allow admins to bypass maintenance mode
            if (req.user && req.user.role === 'admin') {
                return next();
            }
            return res.status(503).json({
                message: 'System is under maintenance. Please try again later.'
            });
        }
        next();
    } catch (error) {
        next(); // Default to allowing if settings check fails
    }
};

module.exports = { protect, admin, checkMaintenance };
