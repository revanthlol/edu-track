const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Enrollment extends Model {
        static associate(models) {
            // AN ENROLLMENT BELONGS TO ONE USER AND ONE COURSE
            Enrollment.belongsTo(models.User, { foreignKey: 'userId' });
            Enrollment.belongsTo(models.Course, { foreignKey: 'courseId' }); // <-- THIS LINE IS THE FIX.
        }
    }
    Enrollment.init({
        userId: DataTypes.INTEGER, courseId: DataTypes.INTEGER
    }, { sequelize, modelName: 'Enrollment', tableName: 'enrollments' });
    return Enrollment;
};