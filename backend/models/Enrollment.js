const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Enrollment extends Model {
        static associate(models) {
            Enrollment.belongsTo(models.User, { foreignKey: 'userId' });
            Enrollment.belongsTo(models.Course, { foreignKey: 'courseId' });
        }
    }
    Enrollment.init({
        userId: DataTypes.INTEGER, courseId: DataTypes.INTEGER
    }, { sequelize, modelName: 'Enrollment', tableName: 'enrollments' });
    return Enrollment;
};