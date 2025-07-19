// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// *** THIS IS THE CRITICAL FIX ***
// The token must include the user's ID AND their ROLE.
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { // <-- ROLE IS NOW INCLUDED
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });
        if (user) {
            const token = generateToken(user.id, user.role); // <-- Pass role here
            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.scope(null).findOne({ where: { email } });
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user.id, user.role); // <-- Pass role here too
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
};