// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

dotenv.config();

// *** THIS IS THE CRITICAL FIX ***
// We MUST connect to the database when the server starts.
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// SECURE, ONE-TIME SEEDING ENDPOINT
// This route now requires a secret key to prevent unauthorized access.
app.get('/api/seed', async (req, res) => {
    // Check for a secret key in the query. Use a hard-to-guess secret.
    if (req.query.secret !== process.env.SEED_SECRET) {
        return res.status(403).json({ message: 'Forbidden: Invalid secret for seeding.' });
    }

    try {
        await sequelize.sync({ force: true });
        await User.create({ name: 'Admin', email: 'admin@edu.track', password: 'password123', role: 'admin' });
        await Course.bulkCreate([
            { courseName: 'Intro to Programming', description: 'JS fundamentals.', credits: 3 },
            { courseName: 'Advanced Web Dev', description: 'React and Node.js.', credits: 4 },
            { courseName: 'Database Design', description: 'SQL mastery.', credits: 4 },
        ]);
        res.status(200).json({ message: 'Database seeded successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Database seeding failed.', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});