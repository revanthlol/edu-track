// backend/controllers/userController.js
const { User } = require('../models');

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
exports.getUserProfile = async (req, res) => {
    // req.user is attached by our 'protect' middleware
    if (req.user) {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateUserProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Password is not updated here for security. This would be a separate "change password" feature.
        const updatedUser = await user.save();
        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};