// backend/models/course.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model {
        static associate(models) {
            Course.belongsTo(models.User, { as: 'faculty', foreignKey: 'facultyId', onDelete: 'SET NULL' });
            Course.belongsTo(models.Department, { foreignKey: 'departmentId', onDelete: 'SET NULL' });
            Course.hasMany(models.Enrollment, { foreignKey: 'courseId', onDelete: 'CASCADE' });
            Course.hasMany(models.Grade, { foreignKey: 'courseId', onDelete: 'CASCADE' });
            Course.hasMany(models.Attendance, { foreignKey: 'courseId', onDelete: 'CASCADE' });
        }
    }
    Course.init({
        courseName: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: DataTypes.TEXT,
        credits: { type: DataTypes.INTEGER, allowNull: false },
        facultyId: DataTypes.INTEGER,
        departmentId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Course',
        tableName: 'courses',
        // --- FINAL ADDITION: PERFORMANCE INDEXES ---
        indexes: [
            { fields: ['facultyId'] },    // Speeds up finding courses by teacher
            { fields: ['departmentId'] }  // Speeds up finding courses by department
        ]
    });
    return Course;
};