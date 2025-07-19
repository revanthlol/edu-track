// backend/controllers/facultyController.js
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

const checkFaculty = (req, res) => { /* ... (no changes) ... */ };
exports.getMyCourses = async (req, res) => { /* ... (no changes) ... */ };
exports.getEnrolledStudents = async (req, res) => { /* ... (no changes) ... */ };
exports.submitGrade = async (req, res) => { /* ... (no changes) ... */ };

// --- NEW FUNCTIONS FOR ATTENDANCE ---

// @desc    Get attendance for a specific course and date
// @route   GET /api/faculty/courses/:courseId/attendance?date=YYYY-MM-DD
// @access  Private/Faculty
exports.getAttendance = async (req, res) => {
    if (!checkFaculty(req, res)) return;
    const { courseId } = req.params;
    const { date } = req.query; // Expects date in 'YYYY-MM-DD' format

    try {
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Course not found or not assigned to you.' });

        const attendanceRecords = await Attendance.findAll({ where: { courseId, date } });
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching attendance.' });
    }
};

// @desc    Mark or update attendance for students
// @route   POST /api/faculty/courses/:courseId/attendance
// @access  Private/Faculty
exports.markAttendance = async (req, res) => {
    if (!checkFaculty(req, res)) return;
    const { courseId } = req.params;
    const { date, attendances } = req.body; // `attendances` is an array of { studentId, status }

    try {
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Not authorized to mark attendance for this course.' });

        const transactions = attendances.map(att => {
            return Attendance.upsert({
                studentId: att.studentId,
                courseId: courseId,
                date: date,
                status: att.status,
            });
        });

        await Promise.all(transactions);
        res.status(200).json({ message: 'Attendance updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating attendance.' });
    }
};