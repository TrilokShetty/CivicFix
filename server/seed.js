const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Report = require('./models/Report');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civicfix');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data (optional, but good for reset)
        // await User.deleteMany({});
        // await Report.deleteMany({});

        // check if demo user exists
        let demoUser = await User.findOne({ email: 'user@test.com' });

        if (!demoUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            demoUser = new User({
                name: 'Demo User',
                email: 'user@test.com',
                password: hashedPassword,
                role: 'user'
            });
            await demoUser.save();
            console.log('Demo User Created: user@test.com / 123456');
        } else {
            console.log('Demo User already exists');
        }

        let adminUser = await User.findOne({ email: 'admin@test.com' });
        if (!adminUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            adminUser = new User({
                name: 'Admin User',
                email: 'admin@test.com',
                password: hashedPassword,
                role: 'department_head',
                department: 'Electrical'
            });
            await adminUser.save();
            console.log('Admin User Created: admin@test.com / 123456 (Electrical Dept)');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
