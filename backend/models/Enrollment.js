// backend/models/Enrollment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'id'
        }
    }
}, {
    tableName: 'enrollments',
    timestamps: true,
});

// Define Associations
User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });

module.exports = Enrollment;