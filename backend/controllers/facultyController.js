// backend/controllers/facultyController.js
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Grade = require('../models/Grade');

// Helper to ensure user is faculty
const checkFaculty = (req, res) => {
    if (req.user.role !== 'faculty') {
        res.status(403).json({ message: 'Forbidden: Faculty access only.' });
        return false;
    }
    return true;
};

// @desc    Get courses taught by the current faculty member
// @route   GET /api/faculty/my-courses
// @access  Private/Faculty
exports.getMyCourses = async (req, res) => {
    if (!checkFaculty(req, res)) return;

    try {
        const courses = await Course.findAll({ where: { facultyId: req.user.id } });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching courses.' });
    }
};

// @desc    Get students enrolled in a specific course taught by the faculty
// @route   GET /api/faculty/courses/:courseId/students
// @access  Private/Faculty
exports.getEnrolledStudents = async (req, res) => {
    if (!checkFaculty(req, res)) return;

    try {
        const courseId = req.params.courseId;
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });

        if (!course) {
            return res.status(404).json({ message: 'Course not found or you are not assigned to it.' });
        }

        const enrollments = await Enrollment.findAll({
            where: { courseId },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email'] // Get student details
            }]
        });
        
        // Extract just the user data
        const students = enrollments.map(e => e.User);

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching students.' });
    }
};

// @desc    Submit or update a grade for a student
// @route   POST /api/faculty/grades
// @access  Private/Faculty
exports.submitGrade = async (req, res) => {
    if (!checkFaculty(req, res)) return;

    const { studentId, courseId, grade, comments } = req.body;

    try {
        // Verify faculty teaches this course
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) {
            return res.status(403).json({ message: 'You are not authorized to grade this course.' });
        }

        // Upsert the grade: update if exists, create if not
        const [newGrade, created] = await Grade.upsert({
            studentId,
            courseId,
            grade,
            comments
        });

        res.status(created ? 201 : 200).json(newGrade);
    } catch (error) {
        res.status(500).json({ message: 'Server error submitting grade.' });
    }
};