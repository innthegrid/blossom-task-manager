const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for signing tokens (from .env)
const JWT_SECRET = process.env.JWT_SECRET || 'blossom-super-secret-key-change-in-production';

// Token expiration time
const TOKEN_EXPIRY = {
    ACCESS: '24h', // Access token lasts 24 hours
    REFRESH: '7d' // Refresh token lasts 7 days
};

/**
 * Generate JWT token for a user
 * @param {Object} user - User object (must have id)
 * @param {String} type - Token type ('access' or 'refresh')
 * @returns {string} JWT token
 */

const generateToken = (user, type = 'access') => {
    const payload = {
        userId: user.id,
        email: user.email,
        username: user.username,
        type: type
    };

    const expiresIn = type === 'access' ? TOKEN_EXPIRY.ACCESS : TOKEN_EXPIRY.REFRESH;

    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error(`Invalid token: ${error.message}`);
    }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - "Bearer <token>"
 * @returns {string|null} Token or null
 */
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove "Bearer " prefix
};

/**
 * Generate token response
 * @param {Object} user - User object
 * @returns {Object} Token response with user info
 */
const generateAuthResponse = (user) => {
    const accessToken = generateToken(user, 'access');
    const refreshToken = generateToken(user, 'refresh');

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            theme: user.theme,
            createdAt: user.createdAt
        },
        tokens: {
            accessToken,
            refreshToken,
            accessExpiresIn: TOKEN_EXPIRY.ACCESS,
            refreshExpiresIn: TOKEN_EXPIRY.REFRESH
        },
        blossom: {
            message: 'Welcome to Blossom!',
            petals: 'Your garden awaits.',
            emoji: '🌸✨'
        }
    };
}

module.exports = {
    generateToken,
    verifyToken,
    extractToken,
    generateAuthResponse,
    JWT_SECRET,
    TOKEN_EXPIRY
};