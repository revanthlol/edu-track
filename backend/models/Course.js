// backend/models/Course.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
    }
}, {
    tableName: 'courses',
    timestamps: true,
});

module.exports = Course;