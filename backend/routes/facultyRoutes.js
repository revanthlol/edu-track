// backend/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { getMyCourses, getEnrolledStudents, submitGrade } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

router.get('/my-courses', getMyCourses);
router.get('/courses/:courseId/students', getEnrolledStudents);
router.post('/grades', submitGrade);

module.exports = router;