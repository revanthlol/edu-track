const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Attendance extends Model {
        static associate(models) {
            Attendance.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
            Attendance.belongsTo(models.Course, { foreignKey: 'courseId' });
        }
    }
    Attendance.init({
        date: { type: DataTypes.DATEONLY, allowNull: false },
        status: { type: DataTypes.ENUM('Present', 'Absent', 'Late'), allowNull: false },
        studentId: DataTypes.INTEGER, courseId: DataTypes.INTEGER
    }, { sequelize, modelName: 'Attendance', tableName: 'attendances', indexes: [{ unique: true, fields: ['studentId', 'courseId', 'date'] }] });
    return Attendance;
};  