// backend/controllers/facultyController.js
const { sequelize } = require('../config/database');
const { Course, Enrollment, User, Grade, Attendance } = require('../models');
const isFaculty = (req, res) => { if (req.user.role !== 'faculty') { res.status(403).json({ message: 'Forbidden: Faculty access only.' }); return false; } return true; };
exports.getMyCourses = async (req, res) => { if (!isFaculty(req, res)) return; try { const c = await Course.findAll({ where: { facultyId: req.user.id } }); res.json(c); } catch (e) { res.status(500).json({ message: 'Server error' }); } };
exports.getEnrolledStudents = async (req, res) => { if (!isFaculty(req, res)) return; try { const c = await Course.findOne({ where: { id: req.params.courseId, facultyId: req.user.id } }); if (!c) return res.status(404).json({ message: 'Course not found or not assigned.' }); const e = await Enrollment.findAll({ where: { courseId: req.params.courseId }, include: [{ model: User, attributes: ['id', 'name', 'email'] }] }); res.json(e.map(i => i.User)); } catch (e) { res.status(500).json({ message: 'Server error' }); } };
exports.submitGrade = async (req, res) => { if (!isFaculty(req, res)) return; const { studentId, courseId, grade, comments } = req.body; try { const c = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } }); if (!c) return res.status(403).json({ message: 'Not authorized.' }); const [g] = await Grade.upsert({ studentId, courseId, grade, comments }); res.status(200).json(g); } catch (e) { res.status(500).json({ message: 'Server error' }); } };
exports.getAttendance = async (req, res) => { if (!isFaculty(req, res)) return; const { courseId } = req.params; const { date } = req.query; try { const c = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } }); if (!c) return res.status(403).json({ message: 'Not authorized.' }); const r = await Attendance.findAll({ where: { courseId, date } }); res.json(r); } catch (e) { res.status(500).json({ message: 'Server error' }); } };
exports.markAttendance = async (req, res) => { if (!isFaculty(req, res)) return; const { courseId } = req.params; const { date, attendances } = req.body; try { const c = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } }); if (!c) return res.status(403).json({ message: 'Not authorized.' }); const t = attendances.map(a => Attendance.upsert({ studentId: a.studentId, courseId, date, status: a.status })); await Promise.all(t); res.status(200).json({ message: 'Attendance updated.' }); } catch (e) { res.status(500).json({ message: 'Server error' }); } };

// --- NEW FINAL FUNCTION ---
// @desc    Get full attendance report for a course
// @route   GET /api/faculty/courses/:courseId/report
// @access  Private/Faculty
exports.getAttendanceReport = async (req, res) => {
    if (!isFaculty(req, res)) return;
    const { courseId } = req.params;
    try {
        const course = await Course.findOne({ where: { id: courseId, facultyId: req.user.id } });
        if (!course) return res.status(403).json({ message: 'Not authorized.' });

        const report = await User.findAll({
            attributes: ['id', 'name'],
            include: [{
                model: Enrollment,
                where: { courseId },
                attributes: [],
            }, {
                model: Attendance,
                as: 'attendances', // Requires association on User model
                where: { courseId },
                attributes: [
                    [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'Present' THEN 1 END")), 'presentCount'],
                    [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'Absent' THEN 1 END")), 'absentCount'],
                    [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'Late' THEN 1 END")), 'lateCount'],
                ],
                required: false
            }],
            group: ['User.id', 'User.name'],
        });
        res.json(report);
    } catch (error) { res.status(500).json({ message: 'Server error fetching report.'}); }
};  