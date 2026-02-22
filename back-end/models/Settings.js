const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    maintenanceMode: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    allowRegistrations: { type: Boolean, default: true },
    twoFactor: { type: Boolean, default: false },
    siteTitle: { type: String, default: 'AdminPro' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', SettingsSchema);
