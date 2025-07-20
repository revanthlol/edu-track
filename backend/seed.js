// backend/seed.js
const { sequelize, User, Department, Course, Enrollment, Grade, Attendance } = require('./models');

const seedDatabase = async () => {
    try {
        console.log('--- STARTING COMPLETE DATABASE SEED ---');
        await sequelize.sync({ force: true });
        console.log('Tables dropped and recreated.');

        const depts = await Department.bulkCreate([ { name: 'Computer Science' }, { name: 'Business Administration' }, { name: 'Fine Arts' } ]);
        console.log(`${depts.length} departments created.`);

        const admin = await User.create({ name: 'Admin User', email: 'admin@edu.track', password: 'password123', role: 'admin' });
        const faculty = await User.create({ name: 'Dr. Eleanor Vance', email: 'faculty@edu.track', password: 'password123', role: 'faculty', departmentId: depts[0].id });
        const students = await User.bulkCreate([ { name: 'Alice Johnson', email: 'alice@test.com', password: 'password123', role: 'student', departmentId: depts[0].id }, { name: 'Bob Williams', email: 'bob@test.com', password: 'password123', role: 'student', departmentId: depts[1].id } ]);
        console.log('Users created.');
        
        const courses = await Course.bulkCreate([ { courseName: 'Intro to Programming', description: 'JS fundamentals.', credits: 3, facultyId: faculty.id, departmentId: depts[0].id }, { courseName: 'Advanced Web Dev', description: 'React and Node.js.', credits: 4, facultyId: faculty.id, departmentId: depts[0].id }, { courseName: 'Intro to Business', description: 'Management 101.', credits: 3, departmentId: depts[1].id }]);
        console.log('Courses created and assigned.');

        await Enrollment.bulkCreate([{ userId: students[0].id, courseId: courses[0].id }, { userId: students[1].id, courseId: courses[0].id }]);
        await Grade.bulkCreate([{ studentId: students[0].id, courseId: courses[0].id, grade: 'A-' }]);
        console.log('Enrollments and grades created.');
        
        console.log('--- SEEDING COMPLETE ---');
        process.exit(0);
    } catch (error) {
        console.error('--- SEEDING FAILED ---', error);
        process.exit(1);
    }
};
seedDatabase();