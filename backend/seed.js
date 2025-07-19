// backend/seed.js
const { sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const seedDatabase = async () => {
    try {
        console.log('Starting database seed...');

        // This will DROP all tables and recreate them. Perfect for a clean slate.
        await sequelize.sync({ force: true });
        console.log('Database synchronized! Tables dropped and recreated.');

        // --- Create Admin User ---
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@edu.track',
            password: 'password123', // It will be hashed automatically by the model hook
            role: 'admin',
        });
        console.log('Admin user created:', admin.get({ plain: true }));

        // --- Create Sample Courses ---
        const courses = await Course.bulkCreate([
            { courseName: 'Introduction to Programming', description: 'Learn the fundamentals of programming using JavaScript.', credits: 3 },
            { courseName: 'Advanced Web Development', description: 'Deep dive into modern web technologies like React and Node.js.', credits: 4 },
            { courseName: 'Database Design & Management', description: 'Master SQL and NoSQL database design principles.', credits: 4 },
            { courseName: 'Software Engineering Principles', description: 'Explore the methodologies of building large-scale software.', credits: 3 },
            { courseName: 'Cloud Computing Fundamentals', description: 'An introduction to AWS, Azure, and Google Cloud.', credits: 3 },
        ]);
        console.log(`${courses.length} courses created.`);

        console.log('--- SEEDING COMPLETE ---');
        process.exit(0);

    } catch (error) {
        console.error('--- SEEDING FAILED ---');
        console.error(error);
        process.exit(1);
    }
};

seedDatabase();