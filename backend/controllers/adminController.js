// backend/controllers/adminController.js
const { User, Course, Enrollment, Department, Grade, Attendance, sequelize } = require('../models');

// Helper function to ensure only admins can proceed
const checkAdmin = (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden: Admin access only.' });
        return false;
    }
    return true;
};

// --- Dashboard Statistics ---
exports.getDashboardStats = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        const [studentCount, courseCount, enrollmentCount, enrollmentByCourse] = await Promise.all([
            User.count({ where: { role: 'student' } }),
            Course.count(),
            Enrollment.count(),
            Enrollment.findAll({
                attributes: [[sequelize.col('Course.courseName'),'name'],[sequelize.fn('COUNT', sequelize.col('Enrollment.id')), 'enrollments']],
                include: [{ model: Course, attributes: [] }],
                group: ['Course.id', 'Course.courseName'],
                order: [[sequelize.fn('COUNT', sequelize.col('Enrollment.id')), 'DESC']]
            })
        ]);
        res.json({ counts: { students: studentCount, courses: courseCount, enrollments: enrollmentCount }, enrollmentByCourse });
    } catch (error) { res.status(500).json({ message: 'Server error fetching statistics.' }); }
};

// --- User Management ---
exports.getAllUsers = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        const users = await User.findAll({ include: [{ model: Department, attributes: ['name'] }], order: [['name', 'ASC']] });
        const departments = await Department.findAll();
        res.json({ users, departments });
    } catch (error) { res.status(500).json({ message: "Server error fetching user data." }); }
};
exports.createUser = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    const { name, email, password, role, departmentId } = req.body;
    try {
        const newUser = await User.create({ name, email, password, role, departmentId: departmentId === 'none' ? null : departmentId });
        const userWithDept = await User.findByPk(newUser.id, { include: [Department] });
        res.status(201).json(userWithDept);
    } catch (error) { res.status(400).json({ message: 'Error creating user. Email may be in use.' }); }
};
exports.updateUser = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    const { userId } = req.params;
    const { role, departmentId } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        user.role = role || user.role;
        user.departmentId = departmentId === 'none' ? null : departmentId;
        await user.save();
        const updatedUserWithDept = await User.findByPk(userId, { include: [Department] });
        res.json(updatedUserWithDept);
    } catch (error) { res.status(500).json({ message: "Server error updating user." }); }
};
exports.deleteUser = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if(user.id.toString() === req.user.id.toString()) return res.status(400).json({ message: "Cannot delete your own account."});
        await user.destroy();
        res.status(200).json({ message: "User deleted." });
    } catch (error) { res.status(500).json({ message: "Server error deleting user." }); }
};

// --- Course Management ---
exports.getAllCourses = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        const courses = await Course.findAll({ include: [Department, { model: User, as: 'faculty', attributes: ['name', 'id'] }]});
        res.json(courses);
    } catch (error) { res.status(500).json({ message: "Server error fetching courses." }); }
};
exports.createCourse = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    const { courseName, description, credits, facultyId, departmentId } = req.body;
    try {
        const course = await Course.create({ courseName, description, credits, facultyId: facultyId === 'none' ? null : facultyId, departmentId: departmentId === 'none' ? null : departmentId });
        res.status(201).json(course);
    } catch (error) { res.status(400).json({ message: "Failed to create course. Name may be in use." }); }
};
exports.updateCourse = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    const { courseName, description, credits, facultyId, departmentId } = req.body;
    try {
        const course = await Course.findByPk(req.params.courseId);
        if (!course) return res.status(404).json({ message: "Course not found." });
        course.set({ courseName, description, credits, facultyId: facultyId === 'none' ? null : facultyId, departmentId: departmentId === 'none' ? null : departmentId });
        await course.save();
        res.json(course);
    } catch (error) { res.status(500).json({ message: "Server error updating course." }); }
};
exports.deleteCourse = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        const course = await Course.findByPk(req.params.courseId);
        if (!course) return res.status(404).json({ message: "Course not found." });
        await course.destroy();
        res.status(200).json({ message: "Course deleted successfully." });
    } catch (error) { res.status(500).json({ message: "Server error deleting course." }); }
};