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
        references: { model: User, key: 'id' }
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: { model: Course, key: 'id' }
    }
}, {
    tableName: 'enrollments',
    timestamps: true,
});

// --- THIS IS THE CRITICAL FIX ---
// We must explicitly tell Sequelize that an Enrollment record belongs to one User and one Course.
// This allows the join in the adminController to function correctly.
Enrollment.belongsTo(User, { foreignKey: 'userId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });
// ------------------------------

// The Many-to-Many associations are also kept for other types of queries
User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });

module.exports = Enrollment;