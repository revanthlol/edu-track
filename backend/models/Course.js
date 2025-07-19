// backend/models/Course.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Department = require('./Department'); // <-- IMPORT

const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    courseName: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    credits: { type: DataTypes.INTEGER, allowNull: false },
    facultyId: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'id' }},
    departmentId: { // <-- NEW FIELD
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: Department, key: 'id' }
    }
}, {
    tableName: 'courses',
    timestamps: true,
});

Course.belongsTo(User, { as: 'faculty', foreignKey: 'facultyId' });
Course.belongsTo(Department, { foreignKey: 'departmentId' }); // <-- NEW ASSOCIATION

module.exports = Course;