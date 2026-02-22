const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const email = 'luharabhishek09@gmail.com';
        const password = 'abhuuu_0904';

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user with the correct password and ensure they are admin
            user.password = password;
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} password updated and ensured as ADMIN.`);
        } else {
            // Create new admin user if not found
            await User.create({
                name: 'Abhishek',
                email: email,
                password: password,
                role: 'admin'
            });
            console.log(`New admin account created: ${email} with password: ${password}`);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
