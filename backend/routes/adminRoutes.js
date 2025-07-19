// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All admin routes are protected

// Dashboard routes
router.get('/stats', getDashboardStats);

// User management routes
router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:userId')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;