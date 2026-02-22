const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const settings = await Settings.findOne();
        const adminUser = await User.findOne({ email: 'admin@resumepro.com' });
        console.log('System Settings:', settings);
        console.log('Admin User:', adminUser ? { email: adminUser.email, role: adminUser.role } : 'Not found');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
