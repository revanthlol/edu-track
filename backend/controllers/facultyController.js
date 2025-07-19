// backend/controllers/facultyController.js
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

const isFaculty = (req, res) => {
    if (req.user.role !== 'faculty') {
        res.status(403).json({ message: 'Forbidden: Faculty access only.' });
        return false;
    }
    return true;
};

exports.getMyCourses = async (req, res) => {
    if (!isFaculty(req, res)) return;
    try {
        const courses = await Course.findAll({ where: { facultyId: req.user.id } });
        res.json(courses);
    } catch (error) { res.status(500).json({ message: 'Server error fetching courses.' }); }
};

exports.getEnrolledStudents = async (req, res) => {
    if (!isFaculty(req, res)) return;
    try {
        const courseId = req.params.courseId;
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) return res.status(404).json({ message: 'Course not found or you are not assigned to it.' });
        
        const enrollments = await Enrollment.findAll({ where: { courseId }, include: [{ model: User, attributes: ['id', 'name', 'email'] }] });
        const students = enrollments.map(e => e.User);
        res.json(students);
    } catch (error) { res.status(500).json({ message: 'Server error fetching students.' }); }
};

exports.submitGrade = async (req, res) => {
    if (!isFaculty(req, res)) return;
    const { studentId, courseId, grade, comments } = req.body;
    try {
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'You are not authorized to grade this course.' });
        
        const [newGrade] = await Grade.upsert({ studentId, courseId, grade, comments });
        res.status(200).json(newGrade);
    } catch (error) { res.status(500).json({ message: 'Server error submitting grade.' }); }
};

exports.getAttendance = async (req, res) => {
    if (!isFaculty(req, res)) return;
    const { courseId } = req.params;
    const { date } = req.query;
    try {
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Course not found or not assigned to you.' });
        const records = await Attendance.findAll({ where: { courseId, date } });
        res.json(records);
    } catch (error) { res.status(500).json({ message: 'Server error fetching attendance.' }); }
};

exports.markAttendance = async (req, res) => {
    if (!isFaculty(req, res)) return;
    const { courseId } = req.params;
    const { date, attendances } = req.body;
    try {
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Not authorized to mark attendance for this course.' });
        
        const transactions = attendances.map(att => Attendance.upsert({ studentId: att.studentId, courseId, date, status: att.status }));
        await Promise.all(transactions);
        res.status(200).json({ message: 'Attendance updated successfully.' });
    } catch (error) { res.status(500).json({ message: 'Server error updating attendance.' }); }
};