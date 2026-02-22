const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config(); // Load environment variables

console.log('PORT from env:', process.env.PORT);
console.log('MONGODB_URI from env:', process.env.MONGODB_URI);

mongoose.set('bufferCommands', false);

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

const createAdmin = async () => {
    try {
        const User = require('./models/User');
        let admin = await User.findOne({ email: 'admin@resumepro.com' });

        if (!admin) {
            await User.create({
                name: 'Admin User',
                email: 'admin@resumepro.com',
                password: 'adminpassword123',
                role: 'admin'
            });
            console.log('🚀 Default Admin created: admin@resumepro.com / adminpassword123');
        } else if (admin.role !== 'admin') {
            admin.role = 'admin';
            await admin.save();
            console.log('✅ Admin credentials verified and role restored to admin.');
        } else {
            console.log('🔒 Admin system ready.');
        }
    } catch (err) {
        console.error('❌ Error in Admin setup:', err);
    }
};

// Start server first
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Then connect to DB
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MongoDB Connected');
            createAdmin();
        })
        .catch((err) => {
            console.error('MongoDB connection error. Make sure MongoDB is running!');
            console.error(err.message);
        });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});
