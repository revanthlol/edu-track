// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getMyGrades } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-grades', protect, getMyGrades);
module.exports = router;