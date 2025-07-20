const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Grade extends Model {
        static associate(models) {
            Grade.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
            Grade.belongsTo(models.Course, { foreignKey: 'courseId' });
        }
    }
    Grade.init({
        grade: { type: DataTypes.STRING(2), allowNull: false }, comments: DataTypes.TEXT,
        studentId: DataTypes.INTEGER, courseId: DataTypes.INTEGER
    }, { sequelize, modelName: 'Grade', tableName: 'grades', indexes: [{ unique: true, fields: ['studentId', 'courseId'] }]});
    return Grade;
};