// backend/seed.js
const { sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const seedDatabase = async () => {
    try {
        console.log('--- STARTING DATABASE SEED ---');

        await sequelize.sync({ force: true });
        console.log('Tables dropped and recreated.');

        // 1. Create Admin User
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@edu.track',
            password: 'password123',
            role: 'admin',
        });
        console.log('Admin user created.');

        // 2. Create Student Users
        const students = await User.bulkCreate([
            { name: 'Alice Johnson', email: 'alice@test.com', password: 'password123' },
            { name: 'Bob Williams', email: 'bob@test.com', password: 'password123' },
            { name: 'Charlie Brown', email: 'charlie@test.com', password: 'password123' },
        ]);
        console.log(`${students.length} student users created.`);
        
        // 3. Create Sample Courses
        const courses = await Course.bulkCreate([
            { courseName: 'Intro to Programming', description: 'JS fundamentals.', credits: 3 },
            { courseName: 'Advanced Web Dev', description: 'React and Node.js.', credits: 4 },
            { courseName: 'Database Design', description: 'SQL mastery.', credits: 4 },
            { courseName: 'Software Engineering', description: 'Agile & DevOps.', credits: 3 },
            { courseName: 'Cloud Computing', description: 'AWS, Azure, GCP.', credits: 3 },
        ]);
        console.log(`${courses.length} courses created.`);

        // 4. Create Enrollments to make the data meaningful
        await Enrollment.bulkCreate([
            { userId: students[0].id, courseId: courses[0].id }, // Alice -> Programming
            { userId: students[0].id, courseId: courses[2].id }, // Alice -> Databases
            { userId: students[1].id, courseId: courses[0].id }, // Bob -> Programming
            { userId: students[1].id, courseId: courses[1].id }, // Bob -> Web Dev
            { userId: students[2].id, courseId: courses[3].id }, // Charlie -> Engineering
        ]);
        console.log('Sample enrollments created.');
        
        console.log('--- SEEDING COMPLETE ---');
        process.exit(0);
    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        process.exit(1);
    }
};

seedDatabase();