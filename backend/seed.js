// backend/seed.js
const { sequelize } = require('../config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Grade = require('./models/Grade');
const Attendance = require('./models/Attendance');
const Department = require('./models/Department');

const seedDatabase = async () => {
    try {
        console.log('--- STARTING COMPLETE DATABASE SEED ---');
        await sequelize.sync({ force: true });
        console.log('Tables dropped and recreated.');

        const depts = await Department.bulkCreate([
            { name: 'Computer Science' },
            { name: 'Business Administration' },
            { name: 'Fine Arts' }
        ]);
        console.log(`${depts.length} departments created.`);

        const admin = await User.create({ name: 'Admin User', email: 'admin@edu.track', password: 'password123', role: 'admin' });
        const faculty = await User.create({ name: 'Dr. Eleanor Vance', email: 'faculty@edu.track', password: 'password123', role: 'faculty', departmentId: depts[0].id });
        const students = await User.bulkCreate([
            { name: 'Alice Johnson', email: 'alice@test.com', password: 'password123', role: 'student', departmentId: depts[0].id },
            { name: 'Bob Williams', email: 'bob@test.com', password: 'password123', role: 'student', departmentId: depts[1].id },
        ]);
        console.log('Users created (Admin, Faculty, Students).');
        
        const courses = await Course.bulkCreate([
            { courseName: 'Intro to Programming', description: 'JS fundamentals.', credits: 3, facultyId: faculty.id, departmentId: depts[0].id },
            { courseName: 'Advanced Web Dev', description: 'React and Node.js.', credits: 4, facultyId: faculty.id, departmentId: depts[0].id },
            { courseName: 'Intro to Business', description: 'Management 101.', credits: 3, departmentId: depts[1].id },
        ]);
        console.log('Courses created and assigned.');

        await Enrollment.bulkCreate([{ userId: students[0].id, courseId: courses[0].id }, { userId: students[1].id, courseId: courses[0].id }]);
        console.log('Enrollments created.');

        await Grade.bulkCreate([{ studentId: students[0].id, courseId: courses[0].id, grade: 'A-' }]);
        console.log('Sample grades created.');
        
        console.log('--- SEEDING COMPLETE ---');
        if (process.env.NODE_ENV !== 'test') { process.exit(0); }
    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        if (process.env.NODE_ENV !== 'test') { process.exit(1); }
    }
};

// Allows the seeder to be called from the command line
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;