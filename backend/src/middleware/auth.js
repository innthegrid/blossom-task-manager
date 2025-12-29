const { extractToken, verifyToken } = require('../utils/jwt');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user ID to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Please log in to access this garden',
                status: 'error'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Check token type (should be access token for API calls)
        if (decoded.type !== 'access') {
            return res.status(401).json({
                error: 'Invalid token type',
                message: 'Please use an access token',
                status: 'error'
            });
        }

        // Attach user info to request
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userUsername = decoded.username;

        // Log authentication
        console.log(`Authenticated ${decoded.email} (${decoded.userId})`);

        next();
    } catch (error) {
        console.error('Authentication error:', error.message);

        // Handle different JWT errors
        let message = 'Invalid authentication token';
        if (error.name === 'TokenExpiredError') {
            message = 'Token has expired. Please log in again.';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token format';
        }

        res.status(401).json({
            error: 'Authentication failed',
            message,
            status: 'error',
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Optional authentication
 * Useful for public endpoints that have optional user features
 */
const authenticateOptional = async (req, res, next) => {
    try {
        const token = extractToken(res.headers.authorization);

        if (token) {
            const decoded = verifyToken(token);
            if (decoded.type === 'access') {
                req.userId = decoded.userId;
                req.userEmail = decoded.email;
                req.userUsername = decoded.username;
            }
        }
    } catch (error) {
        // Silently ignore invalid tokens for optional auth
        console.log('Optional auth token invalid (ignored):', error.message);
    }

    next();
};

module.exports = {
    authenticate,
    authenticateOptional
};