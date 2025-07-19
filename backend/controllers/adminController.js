// backend/controllers/adminController.js
const { sequelize } = require('../config/database');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Department = require('../models/Department');

// Helper function to ensure only admins can proceed
const checkAdmin = (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden: Admin access only.' });
        return false;
    }
    return true;
};

// --- Dashboard Stats (Existing Function) ---
exports.getDashboardStats = async (req, res) => { /* ... existing correct code ... */ };

// --- NEW USER MANAGEMENT FUNCTIONS ---

// @desc    Get all users and departments
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        const users = await User.findAll({ include: [Department] });
        const departments = await Department.findAll();
        res.json({ users, departments });
    } catch (error) { res.status(500).json({ message: "Server error fetching user data." }); }
};

// @desc    Create a new user (student or faculty)
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    const { name, email, password, role, departmentId } = req.body;
    try {
        const newUser = await User.create({ name, email, password, role, departmentId: departmentId || null });
        res.status(201).json(newUser);
    } catch (error) { res.status(400).json({ message: 'Error creating user. Email may already be in use.' }); }
};

// @desc    Update a user's role and department
// @route   PUT /api/admin/users/:userId
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    const { userId } = req.params;
    const { role, departmentId } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        
        user.role = role || user.role;
        user.departmentId = departmentId === '' ? null : departmentId || user.departmentId; // Allow un-assigning department
        await user.save();
        res.json(user);
    } catch (error) { res.status(500).json({ message: "Server error updating user." }); }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    if (!checkAdmin(req, res)) return;
    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Prevent admin from deleting themselves
        if(user.id === req.user.id) return res.status(400).json({ message: "Cannot delete your own admin account."});

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) { res.status(500).json({ message: "Server error deleting user." }); }
};