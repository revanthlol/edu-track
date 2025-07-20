// backend/models/user.js
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {
        // This is the correct, final, working version of this method.
        async matchPassword(enteredPassword) {
            // It compares the password you type in with 'this.password' from the database instance.
            return await bcrypt.compare(enteredPassword, this.password);
        }
        static associate(models) {
            User.belongsTo(models.Department, { foreignKey: 'departmentId' });
            User.hasMany(models.Enrollment, { foreignKey: 'userId' });
            User.hasMany(models.Grade, { as: 'grades', foreignKey: 'studentId' });
            User.hasMany(models.Attendance, { as: 'attendances', foreignKey: 'studentId' });
        }
    }
    User.init({
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('student', 'faculty', 'admin'), defaultValue: 'student' },
        departmentId: DataTypes.INTEGER
    }, {
        sequelize, modelName: 'User', tableName: 'users',
        indexes: [{ fields: ['email'] }],
        hooks: {
            beforeCreate: async (user) => { if(user.password) user.password = await bcrypt.hash(user.password, 10); },
            beforeUpdate: async (user) => { if(user.changed('password')) user.password = await bcrypt.hash(user.password, 10); }
        },
        defaultScope: { attributes: { exclude: ['password'] } }
    });
    return User;
};