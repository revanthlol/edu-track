// backend/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { getMyCourses, getEnrolledStudents, submitGrade, getAttendance, markAttendance, getAttendanceReport } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');


// Protect all routes in this file
router.use(protect);

router.get('/my-courses', getMyCourses);
router.get('/courses/:courseId/students', getEnrolledStudents);
router.post('/grades', submitGrade);
router.get('/courses/:courseId/attendance', getAttendance);
router.post('/courses/:courseId/attendance', markAttendance);
router.get('/courses/:courseId/report', getAttendanceReport);

module.exports = router;