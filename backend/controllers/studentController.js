// backend/controllers/studentController.js
const Grade = require('../models/Grade');
const Course = require('../models/Course');

exports.getMyGrades = async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const grades = await Grade.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Course, attributes: ['courseName', 'credits'] }]
        });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching grades.' });
    }
};