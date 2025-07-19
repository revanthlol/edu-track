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
        references: { model: User, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Course, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'grades',
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['studentId', 'courseId'] // A student can only have one final grade per course
    }]
});

Grade.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Grade.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Grade;