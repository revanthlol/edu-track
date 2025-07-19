// backend/models/Grade.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

const Grade = sequelize.define('Grade', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    grade: {
        type: DataTypes.STRING(2), // e.g., A+, B-, C
        allowNull: false,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' }
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Course, key: 'id' }
    }
}, {
    tableName: 'grades',
    timestamps: true,
    // Ensure a student can only have one grade per course
    indexes: [{
        unique: true,
        fields: ['studentId', 'courseId']
    }]
});

// Define associations
Grade.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Grade.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Grade;