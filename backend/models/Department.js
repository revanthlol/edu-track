const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Department extends Model {
        static associate(models) { Department.hasMany(models.User, { foreignKey: 'departmentId' }); }
    }
    Department.init({
        name: { type: DataTypes.STRING, allowNull: false, unique: true }
    }, { sequelize, modelName: 'Department', tableName: 'departments', timestamps: false });
    return Department;
};
