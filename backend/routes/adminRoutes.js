// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, createUser, updateUser, deleteUser, getAllCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes are protected

router.get('/stats', getDashboardStats);
router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/:userId').put(updateUser).delete(deleteUser);

// --- NEW FINAL COURSE ROUTES ---
router.route('/courses').get(getAllCourses).post(createCourse);
router.route('/courses/:courseId').put(updateCourse).delete(deleteCourse);

module.exports = router;