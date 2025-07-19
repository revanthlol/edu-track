// backend/controllers/courseController.js
const Course = require('../models/Course');
const User = require('../models/User'); // Required for associations if needed

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({ order: [['createdAt', 'DESC']] });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a course (example for future use, admin only)
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
    // --- ROLE CHECK ---
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    // --- END ROLE CHECK ---

    const { courseName, description, credits } = req.body;

    if (!courseName || !credits) {
        return res.status(400).json({ message: 'Course Name and Credits are required.' });
    }

    try {
        const course = await Course.create({ courseName, description, credits });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid course data or course already exists' });
    }
}