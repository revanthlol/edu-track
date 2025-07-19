// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors =require('cors');
const { sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

// Load environment variables
dotenv.config();

// No need to call connectDB() here, as we only need the sequelize instance for seeding
// connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// --- THE ONE-TIME SEEDING ENDPOINT ---
// After deployment, you will visit YOUR_URL.com/api/seed to set up the database.
app.get('/api/seed', async (req, res) => {
    try {
        console.log('--- MANUAL SEEDING INITIATED ---');
        // Drop all tables and recreate them from the models
        await sequelize.sync({ force: true });
        console.log('DATABASE SYNCED!');

        // Create the default Admin user
        await User.create({
            name: 'Admin',
            email: 'admin@edu.track',
            password: 'password123', // Will be hashed by the model hook
            role: 'admin',
        });
        console.log('ADMIN USER CREATED');

        // Create a set of sample courses
        await Course.bulkCreate([
            { courseName: 'Introduction to Programming', description: 'Learn the fundamentals of programming using JavaScript.', credits: 3 },
            { courseName: 'Advanced Web Development', description: 'Deep dive into modern web technologies like React and Node.js.', credits: 4 },
            { courseName: 'Database Design & Management', description: 'Master SQL and NoSQL database design principles.', credits: 4 },
            { courseName: 'Software Engineering Principles', description: 'Explore the methodologies of building large-scale software.', credits: 3 },
            { courseName: 'Cloud Computing Fundamentals', description: 'An introduction to AWS, Azure, and Google Cloud.', credits: 3 },
        ]);
        console.log('SAMPLE COURSES CREATED');
        
        res.status(200).json({ message: 'Database seeded successfully! You can now log in with admin@edu.track and password "password123".' });

    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        res.status(500).json({ message: 'Database seeding failed.', error: error.message });
    }
});


// Simple Base Route
app.get('/', (req, res) => {
    res.send('EduTrack Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});