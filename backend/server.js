// backend/server.js

// --- Core Node.js and npm package imports ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// --- Local module imports ---
// Database connection and models
const { connectDB, sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

// Route handlers for different parts of the API
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// --- Initial Server Setup ---
// Load environment variables from the .env file into process.env
dotenv.config();

// *** CRITICAL STEP ***
// Establish the connection to the database as soon as the application starts.
connectDB();

// Initialize the main Express application
const app = express();
const PORT = process.env.PORT || 3001;


// --- Global Middlewares ---
// Enable Cross-Origin Resource Sharing (CORS) for all incoming requests
app.use(cors());

// Enable the Express app to parse incoming request bodies with JSON payloads
app.use(express.json());

// Enable the Express app to parse incoming request bodies with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));


// --- API Route Definitions ---
// Mount the various routers on their designated URL paths.
// Any request starting with '/api/auth' will be handled by authRoutes.
app.use('/api/auth', authRoutes);
// Any request starting with '/api/courses' will be handled by courseRoutes.
app.use('/api/courses', courseRoutes);
// Any request starting with '/api/enrollments' will be handled by enrollmentRoutes.
app.use('/api/enrollments', enrollmentRoutes);
// Any request starting with '/api/users' will be handled by userRoutes.
app.use('/api/users', userRoutes);
// Any request starting with '/api/admin' will be handled by adminRoutes.
app.use('/api/admin', adminRoutes);


// --- Secure, One-Time Database Seeding Endpoint ---
// This is a special, powerful route used ONLY to initialize the database.
// To prevent unauthorized use, it is protected by a secret key.
app.get('/api/seed', async (req, res) => {
    // 1. Check for the secret key passed as a query parameter
    if (req.query.secret !== process.env.SEED_SECRET) {
        return res.status(403).json({ message: 'Forbidden: Invalid secret key for seeding.' });
    }

    try {
        console.log('--- DATABASE SEEDING INITIATED VIA SECURE ENDPOINT ---');
        
        // 2. Force-sync Sequelize models with the database.
        // { force: true } will DROP all existing tables and recreate them.
        await sequelize.sync({ force: true });
        console.log('Tables dropped and recreated successfully.');

        // 3. Populate the 'users' table with a default admin and sample students
        const admin = await User.create({ name: 'Admin', email: 'admin@edu.track', password: 'password123', role: 'admin' });
        const students = await User.bulkCreate([
            { name: 'Alice Johnson', email: 'alice@test.com', password: 'password123' },
            { name: 'Bob Williams', email: 'bob@test.com', password: 'password123' },
        ]);
        console.log('Default admin and student users created.');

        // 4. Populate the 'courses' table with sample data
        const courses = await Course.bulkCreate([
            { courseName: 'Intro to Programming', description: 'JS fundamentals.', credits: 3 },
            { courseName: 'Advanced Web Dev', description: 'React and Node.js.', credits: 4 },
            { courseName: 'Database Design', description: 'SQL mastery.', credits: 4 },
        ]);
        console.log('Sample courses created.');
        
        // 5. Create some sample enrollments to link users and courses
        await Enrollment.bulkCreate([
            { userId: students[0].id, courseId: courses[0].id },
            { userId: students[1].id, courseId: courses[1].id },
        ]);
        console.log('Sample enrollments created.');
        
        // 6. Send a success response
        res.status(200).json({ message: 'Database seeded successfully!' });

    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        res.status(500).json({ message: 'Database seeding failed.', error: error.message });
    }
});


// --- Server Startup ---
// Start the Express server and listen for incoming connections on the specified port.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});