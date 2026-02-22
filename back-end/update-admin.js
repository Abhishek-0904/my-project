const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const email = 'luharabhishek09@gmail.com';
        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} is now an ADMIN.`);
        } else {
            // Find old admin and update or just create new
            const oldAdmin = await User.findOne({ email: 'admin@resumepro.com' });
            if (oldAdmin) {
                oldAdmin.email = email;
                oldAdmin.name = 'Abhishek Admin';
                await oldAdmin.save();
                console.log(`Old admin account updated to ${email}.`);
            } else {
                await User.create({
                    name: 'Abhishek Admin',
                    email: email,
                    password: 'adminpassword123', // You should change this later
                    role: 'admin'
                });
                console.log(`New admin account created: ${email}`);
            }
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
