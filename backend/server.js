// backend/server.js

// Core Node.js modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Local module imports
const { connectDB, sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

// Route imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

// *** CRITICAL ***
// Connect to the database as soon as the application starts.
connectDB();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing for all origins
app.use(cors());
// To parse JSON request bodies
app.use(express.json());
// To parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---
// Mount the various routers on their respective paths
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);


// --- Secure, One-Time Seeding Endpoint ---
// This special route is used to initialize the database.
// Access is restricted by a secret key stored in environment variables.
app.get('/api/seed', async (req, res) => {
    // 1. Check for the secret key to prevent unauthorized access
    if (req.query.secret !== process.env.SEED_SECRET) {
        return res.status(403).json({ message: 'Forbidden: Invalid secret key for seeding.' });
    }

    try {
        console.log('--- DATABASE SEEDING INITIATED VIA SECURE ENDPOINT ---');
        
        // 2. Drop all existing tables and recreate them based on Sequelize models
        await sequelize.sync({ force: true });
        console.log('Tables dropped and recreated successfully.');

        // 3. Create a default administrator user
        await User.create({
            name: 'Admin',
            email: 'admin@edu.track',
            password: 'password123', // This will be hashed automatically by the User model's 'beforeCreate' hook
            role: 'admin',
        });
        console.log('Default admin user created.');

        // 4. Populate the database with sample courses
        await Course.bulkCreate([
            { courseName: 'Introduction to Programming', description: 'Learn the fundamentals of programming using JavaScript.', credits: 3 },
            { courseName: 'Advanced Web Development', description: 'Deep dive into modern web technologies like React and Node.js.', credits: 4 },
            { courseName: 'Database Design & Management', description: 'Master SQL and NoSQL database design principles.', credits: 4 },
            { courseName: 'Software Engineering Principles', description: 'Explore the methodologies of building large-scale software.', credits: 3 },
            { courseName: 'Cloud Computing Fundamentals', description: 'An introduction to AWS, Azure, and Google Cloud.', credits: 3 },
        ]);
        console.log('Sample courses created.');
        
        // 5. Send a success response
        res.status(200).json({ message: 'Database seeded successfully! You can now log in with admin@edu.track and password "password123".' });

    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        res.status(500).json({ message: 'Database seeding failed.', error: error.message });
    }
});


// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});