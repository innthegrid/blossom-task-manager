const bcrypt = require('bcryptjs');

// Number of salt rounds for hasing
// Higher = more secure but slower
const SALT_ROUNDS = 10;

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
}

/**
 * Compare a password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches hash
 */
const comparePassword = async (password, hash) => {
    if (!password || !hash) {
        return false;
    }
    return await bcrypt.compare(password, hash);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
    const errors = [];

    if (!password) {
        errors.push('Password is required');
    } else {
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }
        if (password.length > 50) {
            errors.push('Password must not exceed 50 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Generate blossom-themed password hints
 * @returns {Array} Array of password tips
 */
const getPasswordTips = () => {
    return [
        'Like a cherry blossom, make it beautiful but strong',
        'At least 6 petals (characters) long',
        'Mix different types of petals (letters, numbers)',
        'Avoid common patterns that are easy to guess'
    ];
};

module.exports = {
    hashPassword,
    comparePassword,
    validatePassword,
    getPasswordTips,
    SALT_ROUNDS
};