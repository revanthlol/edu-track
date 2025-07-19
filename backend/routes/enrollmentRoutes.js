// backend/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { enrollInCourse, getMyEnrollments } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

// Route for a student to enroll
router.post('/enroll/:courseId', protect, enrollInCourse);

// Route for a student to get their current enrollments
router.get('/my-enrollments', protect, getMyEnrollments);

module.exports = router;