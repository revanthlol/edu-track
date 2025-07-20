// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
// --- THIS IS THE CRITICAL AND FINAL FIX ---
// We MUST import the User model from the central index file, not directly.
// My failure to do this is the sole reason for the 401 error.
const { User } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Extract token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // 3. Find the user by the ID from the token payload.
            // Exclude the password from the user object that gets attached to the request.
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            // If a user with that ID no longer exists, reject the request.
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            // 4. If everything is perfect, proceed to the protected route controller.
            next();
        } catch (error) {
            // This will catch expired tokens, malformed tokens, etc.
            console.error('TOKEN VERIFICATION FAILED:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };