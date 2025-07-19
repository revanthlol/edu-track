// backend/controllers/adminController.js
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    // 1. Double-check if the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access only.' });
    }

    try {
        // 2. Perform all database calculations in parallel for maximum efficiency
        const [studentCount, courseCount, enrollmentCount, enrollmentByCourse] = await Promise.all([
            User.count({ where: { role: 'student' } }),
            Course.count(),
            Enrollment.count(),
            // This is a more advanced query to group enrollments by course
            Enrollment.findAll({
                attributes: [
                    // Get the name of the course
                    [sequelize.col('Course.courseName'), 'name'],
                    // Count how many enrollments for that course
                    [sequelize.fn('COUNT', sequelize.col('Enrollment.id')), 'enrollments']
                ],
                include: [{
                    model: Course,
                    attributes: [] // We only need the name, so don't include other course attributes
                }],
                group: ['Course.id', 'Course.courseName'],
                order: [[sequelize.fn('COUNT', sequelize.col('Enrollment.id')), 'DESC']]
            })
        ]);

        // 3. Format the data perfectly for the frontend
        res.json({
            counts: {
                students: studentCount,
                courses: courseCount,
                enrollments: enrollmentCount
            },
            enrollmentByCourse: enrollmentByCourse
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching statistics.' });
    }
};