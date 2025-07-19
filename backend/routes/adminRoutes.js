// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected and will only be accessible by logged-in users.
// The controller will further verify if the user is an admin.
router.get('/stats', protect, getDashboardStats);

module.exports = router;