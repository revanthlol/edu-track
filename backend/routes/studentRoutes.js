// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getMyGrades } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// Protect all student routes
router.use(protect);

router.get('/my-grades', getMyGrades);

module.exports = router;