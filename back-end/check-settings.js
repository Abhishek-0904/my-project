const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const settings = await Settings.findOne();
        console.log('Current System Settings:', settings);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
