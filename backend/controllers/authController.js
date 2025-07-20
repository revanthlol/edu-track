// backend/controllers/authController.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
};

// --- REGISTER (No changes needed, but provided for completeness) ---
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (await User.findOne({ where: { email } })) { return res.status(400).json({ message: 'User already exists.' }); }
        const user = await User.create({ name, email, password, role: 'student' });
        if (user) { const token = generateToken(user.id, user.role); res.status(201).json({ token, user }); }
    } catch (error) { res.status(500).json({ message: 'Server error during registration.' }); }
};


// --- LOGIN (THIS IS THE CRITICAL AND FINAL FIX) ---
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find the user by their email.
        // `scope(null)` is the most important command: it tells Sequelize to IGNORE the
        // default scope and allow us to retrieve the 'password' field for this one query.
        const user = await User.scope(null).findOne({ where: { email } });

        // 2. Check if a user was found AND if their password matches.
        // The `user.matchPassword` method is now guaranteed to work because `user.password` exists.
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user.id, user.role);
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } else {
            // 3. If either the user is not found or the password does not match, send a single, generic error.
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('--- CATASTROPHIC LOGIN ERROR ---', error);
        res.status(500).json({ message: 'A critical server error occurred during login.' });
    }
};