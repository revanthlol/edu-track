// backend/seed.js
const { sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Grade = require('./models/Grade'); // Import Grade model

const seedDatabase = async () => {
    try {
        console.log('--- STARTING DATABASE SEED ---');
        await sequelize.sync({ force: true });
        console.log('Tables dropped and recreated.');

        const admin = await User.create({ name: 'Admin User', email: 'admin@edu.track', password: 'password123', role: 'admin' });
        
        // 1. Create a Faculty user
        const faculty = await User.create({ name: 'Dr. Professor', email: 'prof@edu.track', password: 'password123', role: 'faculty' });

        const students = await User.bulkCreate([
            { name: 'Alice Johnson', email: 'alice@test.com', password: 'password123' },
            { name: 'Bob Williams', email: 'bob@test.com', password: 'password123' },
        ]);
        console.log('Users created.');
        
        // 2. Assign the faculty to a course
        const courses = await Course.bulkCreate([
            { courseName: 'Intro to Programming', description: 'JS fundamentals.', credits: 3, facultyId: faculty.id }, // Dr. Professor teaches this
            { courseName: 'Advanced Web Dev', description: 'React and Node.js.', credits: 4, facultyId: faculty.id },
            { courseName: 'Database Design', description: 'SQL mastery.', credits: 4 }, // No teacher assigned yet
        ]);
        console.log('Courses created.');

        await Enrollment.bulkCreate([
            { userId: students[0].id, courseId: courses[0].id }, // Alice -> Programming
            { userId: students[1].id, courseId: courses[0].id }, // Bob   -> Programming
            { userId: students[1].id, courseId: courses[1].id }, // Bob   -> Web Dev
        ]);
        console.log('Enrollments created.');
        
        console.log('--- SEEDING COMPLETE ---');
        process.exit(0);
    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        process.exit(1);
    }
};
seedDatabase();