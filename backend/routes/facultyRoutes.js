// backend/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { getMyCourses, getEnrolledStudents, submitGrade, getAttendance, markAttendance } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/my-courses', getMyCourses);
router.get('/courses/:courseId/students', getEnrolledStudents);
router.post('/grades', submitGrade);

// --- NEW ATTENDANCE ROUTES ---
router.get('/courses/:courseId/attendance', getAttendance);
router.post('/courses/:courseId/attendance', markAttendance);

module.exports = router;