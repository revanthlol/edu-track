// backend/controllers/courseController.js
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a course (example for future use, admin only)
// @route   POST /api/courses
// @access  Private (should be admin)
exports.createCourse = async (req, res) => {
    const { courseName, description, credits } = req.body;
    try {
        // TODO: Add admin role check
        const course = await Course.create({ courseName, description, credits });
        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid course data' });
    }
}