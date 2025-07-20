// backend/seed.js

// --- THIS IS THE CRITICAL FIX ---
// The path MUST be './config/database' because the 'config' folder is in the same directory as this file.
// I incorrectly had '../' which caused the crash. My sincere apologies.
const { sequelize } = require('./config/database');
// --- END OF FIX ---

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Grade = require('./models/Grade');
const Attendance = require('./models/Attendance');
const Department = require('./models/Department');

const seedDatabase = async () => {
    try {
        console.log('--- STARTING COMPLETE DATABASE SEED ---');
        // This ensures all models and their new associations are perfectly synced to the database.
        await sequelize.sync({ force: true });
        console.log('Tables dropped and recreated successfully.');

        // 1. Create Departments
        const depts = await Department.bulkCreate([
            { name: 'Computer Science' },
            { name: 'Business Administration' },
            { name: 'Fine Arts' }
        ]);
        console.log(`${depts.length} departments created.`);

        // 2. Create Users and assign Departments
        const admin = await User.create({ name: 'Admin User', email: 'admin@edu.track', password: 'password123', role: 'admin' });
        const faculty = await User.create({ name: 'Dr. Eleanor Vance', email: 'faculty@edu.track', password: 'password123', role: 'faculty', departmentId: depts[0].id });
        const students = await User.bulkCreate([
            { name: 'Alice Johnson', email: 'alice@test.com', password: 'password123', role: 'student', departmentId: depts[0].id },
            { name: 'Bob Williams', email: 'bob@test.com', password: 'password123', role: 'student', departmentId: depts[1].id },
        ]);
        console.log('Users created (Admin, Faculty, Students).');
        
        // 3. Create Courses and assign Departments/Faculty
        const courses = await Course.bulkCreate([
            { courseName: 'Intro to Programming', description: 'JS fundamentals.', credits: 3, facultyId: faculty.id, departmentId: depts[0].id },
            { courseName: 'Advanced Web Dev', description: 'React and Node.js.', credits: 4, facultyId: faculty.id, departmentId: depts[0].id },
            { courseName: 'Intro to Business', description: 'Management 101.', credits: 3, departmentId: depts[1].id },
        ]);
        console.log('Courses created and assigned.');

        // 4. Create Enrollments and Grades
        await Enrollment.bulkCreate([{ userId: students[0].id, courseId: courses[0].id }, { userId: students[1].id, courseId: courses[0].id }]);
        console.log('Enrollments created.');
        await Grade.bulkCreate([{ studentId: students[0].id, courseId: courses[0].id, grade: 'A-' }]);
        console.log('Sample grades created.');
        
        console.log('--- SEEDING COMPLETE ---');
        // We only exit the process if this script is run directly from the command line
        if (require.main === module) {
            process.exit(0);
        }
    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        if (require.main === module) {
            process.exit(1);
        }
    }
};

// This allows 'npm run seed' to work
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;