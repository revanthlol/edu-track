// backend/controllers/studentController.js
const { Grade, Course } = require('../models');

exports.getMyGrades = async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: Access restricted to students.' });
    }
    try {
        const grades = await Grade.findAll({
            where: { studentId: req.user.id },
            include: [{ 
                model: Course, 
                attributes: ['courseName', 'credits'] 
            }],
            order: [['updatedAt', 'DESC']]
        });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching grades.' });
    }
};