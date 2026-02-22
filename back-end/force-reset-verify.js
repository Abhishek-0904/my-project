const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const email = 'luharabhishek09@gmail.com';
        const password = 'abhuuu_0904';

        // Find existing user
        let user = await User.findOne({ email });

        if (user) {
            console.log('User found, resetting password...');
            user.password = password;
            user.role = 'admin';
            await user.save();
            console.log('Password reset successfully.');
        } else {
            console.log('User not found, creating new admin user...');
            await User.create({
                name: 'Abhishek',
                email: email,
                password: password,
                role: 'admin'
            });
            console.log('New admin user created.');
        }

        // Double check by trying to match password immediately
        const verifyUser = await User.findOne({ email });
        const isMatch = await verifyUser.matchPassword(password);
        console.log('Verification match result:', isMatch);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
