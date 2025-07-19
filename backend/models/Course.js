// backend/models/Course.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Import User for the association

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // --- NEW FIELD ---
    // This links a course to a specific faculty member.
    facultyId: {
        type: DataTypes.INTEGER,
        allowNull: true, // A course might not have an assigned faculty yet
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'courses',
    timestamps: true,
});

// Define the association
Course.belongsTo(User, { as: 'faculty', foreignKey: 'facultyId' });

module.exports = Course;