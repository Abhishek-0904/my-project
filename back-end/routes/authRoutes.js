const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Settings = require('../models/Settings');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    if (require('mongoose').connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database is offline. Please start MongoDB.' });
    }
    const { name, email, password, role } = req.body;

    try {
        const settings = await Settings.findOne();
        if (settings && !settings.allowRegistrations) {
            return res.status(403).json({ message: 'User registrations are currently disabled.' });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    if (require('mongoose').connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database is offline. Please start MongoDB.' });
    }
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const settings = await Settings.findOne();

            // Check if 2FA is enabled and user is admin
            if (settings && settings.twoFactor && user.role === 'admin') {
                // Generate OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();

                // Save OTP to user
                user.otpCode = otp;
                user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
                await user.save();

                // Send Email
                try {
                    await sendEmail({
                        email: user.email,
                        subject: 'Admin Login Security Code',
                        message: `Your login verification code is: ${otp}. This code will expire in 10 minutes.`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                                <h2 style="color: #6366f1;">Security Verification</h2>
                                <p>Your login verification code for <b>AdminPro</b> is:</p>
                                <div style="background: #f3f4f6; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px;">
                                    ${otp}
                                </div>
                                <p style="font-size: 12px; color: #666; margin-top: 20px;">
                                    If you didn't attempt to log in, please ignore this email.
                                </p>
                            </div>
                        `
                    });

                    return res.json({
                        requires2FA: true,
                        email: user.email,
                        message: 'Verification code sent to your email'
                    });
                } catch (err) {
                    console.error('Email send failed:', err);
                    return res.status(500).json({ message: 'Failed to send verification code. Please check server email settings.' });
                }
            }

            // Failsafe: Always ensure this email has admin role in response
            const responseRole = user.email === 'admin@resumepro.com' ? 'admin' : user.role;

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: responseRole,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify OTP for 2FA
// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({
            email,
            otpCode: otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired verification code' });
        }

        // Clear OTP
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = router;
