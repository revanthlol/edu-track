// backend/models/Attendance.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('Present', 'Absent', 'Late'), allowNull: false },
    studentId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' }},
    courseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Course, key: 'id' }}
}, {
    tableName: 'attendances',
    timestamps: true,
    indexes: [{ unique: true, fields: ['studentId', 'courseId', 'date'] }]
});

Attendance.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Attendance.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Attendance;