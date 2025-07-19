// backend/controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course'); // To ensure course exists
const User = require('../models/User'); // To ensure user exists

// @desc    Enroll the current user in a course
// @route   POST /api/enrollments/enroll/:courseId
// @access  Private (Students)
exports.enrollInCourse = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id; // From our 'protect' middleware

    try {
        // 1. Check if user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Forbidden: Only students can enroll.' });
        }

        // 2. Check if the course exists
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // 3. Check for duplicate enrollment
        const existingEnrollment = await Enrollment.findOne({
            where: { userId: userId, courseId: courseId }
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'You are already enrolled in this course.' });
        }

        // 4. Create the enrollment
        const newEnrollment = await Enrollment.create({ userId, courseId });

        res.status(201).json({ message: 'Enrollment successful!', enrollment: newEnrollment });

    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: 'Server error during enrollment.' });
    }
};

// @desc    Get all enrollments for the current student
// @route   GET /api/enrollments/my-enrollments
// @access  Private (Students)
exports.getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { userId: req.user.id },
            attributes: ['courseId'] // We only need the course IDs for the frontend
        });
        res.json(enrollments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};