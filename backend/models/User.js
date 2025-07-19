// backend/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const Department = require('./Department');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('student', 'faculty', 'admin'), defaultValue: 'student' },
    departmentId: { // <-- NEW FIELD
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: Department, key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'users',
    timestamps: true,
    defaultScope: { attributes: { exclude: ['password'] } },
    hooks: {
        beforeCreate: async (user) => { if (user.password) { const salt = await bcrypt.genSalt(10); user.password = await bcrypt.hash(user.password, salt); } },
        beforeUpdate: async (user) => { if (user.changed('password')) { const salt = await bcrypt.genSalt(10); user.password = await bcrypt.hash(user.password, salt); } },
    }
});

// A User can belong to one Department
User.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(User, { foreignKey: 'departmentId' });

User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.dataValues.password);
};

module.exports = User;