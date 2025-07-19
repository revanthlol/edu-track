// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { getAllCourses, createCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAllCourses)
    .post(protect, createCourse); // Example for admin

module.exports = router;