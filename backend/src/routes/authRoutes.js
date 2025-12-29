const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authenticateOptional } = require('../middleware/auth');

// Route logger
const blossomLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - Auth ${req.method} ${req.path}`);
    next();
};

router.use(blossomLogger);

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/password-tips', authController.getPasswordTipsHandler);
router.post('/validate', authController.validateToken); // For frontend token validation
router.post('/refresh', authController.refreshToken);

// Protected routes (require authentication)
router.get('/profile', authenticate, authController.getProfile);

// Example of optional authentication
router.get('/public-profile', authenticateOptional, (req, res) => {
    if (req.userId) {
        res.json({
            message: 'You are logged in!',
            userId: req.userId,
            isAuthenticated: true
        });
    } else {
        res.json({
            message: 'Public profile - log in for personalized experience',
            isAuthenticated: false
        });
    }
});

// Welcome
router.get('/welcome', (req, res) => {
    res.json({
        message: 'Welcome to Blossom Authentication!',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile (protected)',
            refresh: 'POST /api/auth/refresh',
            tips: 'GET /api/auth/password-tips'
        },
        theme: 'cherry-blossom-authentication',
        motto: 'Secure your garden, grow your blossoms'
    });
});

module.exports = router;