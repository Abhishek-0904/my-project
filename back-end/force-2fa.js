const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ twoFactor: true });
        } else {
            settings.twoFactor = true;
        }
        await settings.save();
        console.log('2FA has been FORCED ON in the database.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
