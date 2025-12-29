const { prisma } = require('../config/database');
const { hashPassword, comparePassword, validatePassword, getPasswordTips } = require('../utils/password');
const { generateAuthResponse, extractToken, verifyToken } = require('../utils/jwt');

// Helper functions for consistent responses
const blossomResponse = (res, data, message = 'Success', status = 200) => {
    res.status(status).json({
        ...data,
        message,
        status: 'success',
        timestamp: new Date().toISOString()
    });
};

const blossomError = (res, message, status = 400) => {
    res.status(status).json({
        error: message,
        suggestion: 'Please check your data and try again',
        status: 'error',
        timestamp: new Date().toISOString()
    });
};

// Register a new user
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Basic validation
        if (!email || !password) {
            return blossomError(res, 'Email and password are required');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return blossomError(res, 'Please provide a valid email address');
        }

        // Password validation
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return blossomError(res, passwordValidation.errors.join(', '));
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return blossomError(res, 'A garden already exists with this email');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username: username || email.split('@')[0], // Default username from email
                theme: 'cherry-blossom'
            }
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Generate tokens
        const authResponse = generateAuthResponse(userWithoutPassword);

        blossomResponse(res, authResponse, 'Welcome to Blossom! Your garden is ready', 201);
    } catch (error) {
        console.error('Registration error:', error);
        blossomError(res, 'Failed to create account. Please try again.', 500);
    }
};

// Login existing user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return blossomError(res, 'Email and password are required.');
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                tasks: {
                    take: 5, // Include first 5 tasks
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return blossomError(res, 'No blossom found with this email', 404);
        }

        // Verify password
        const passwordValid = await comparePassword(password, user.password);
        if (!passwordValid) {
            return blossomError(res, 'Incorrect password. Please try again.', 401);
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Generate tokens
        const authResponse = generateAuthResponse(userWithoutPassword);

        // Add task count to response
        authResponse.user.taskCount = user.tasks.length;
        authResponse.user.recentTasks = user.tasks;

        blossomResponse(res, authResponse, 'Welcome back to your garden!');
    } catch (error) {
        console.error('Login error:', error);
        blossomError(res, 'Failed to login. Please try again.', 500);
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: { tasks: true }
                },
                tasks: {
                    take: 3,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return blossomError(res, 'User not found.', 404);
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        blossomResponse(res, {
            user: userWithoutPassword,
            blossom: {
                gardenHealth: user._count.tasks > 0 ? 'blooming' : 'ready for new petals',
                petalCount: user._count.tasks,
                emoji: '🌸'
            }
        }, 'Your blossom profile');
    } catch (error) {
        console.error('Profile error:', error);
        blossomError(res, 'Failed to fetch profile', 500);
    }
};

// Refresh access token using refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return blossomError(res, 'Refresh token is required');
        }

        // Verify refresh token
        const decoded = verifyToken(refreshToken);

        if (decoded.type !== 'refresh') {
            return blossomError(res, 'Invalid token type', 401);
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, username: true, theme: true, createdAt: true }
        });

        if (!user) {
            return blossomError(res, 'User not found', 404);
        }

        // Generate new access token
        const { generateToken } = require('../utils/jwt');
        const newAccessToken = generateToken(user, 'access');

        blossomResponse(res, {
            accessToken: newAccessToken,
            user,
            blossom: {
                message: 'Token refreshed!',
                emoji: '🌸✨'
            }
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        blossomError(res, 'Invalid or expired refresh token', 401);
    }
};

// Get password tips (public endpoint)
const getPasswordTipsHandler = (req, res) => {
    blossomResponse(res, {
        tips: getPasswordTips(),
        blossom: {
            message: 'Grow a strong password garden!',
            emoji: '🌸🔒'
        }
    });
};

// Validate token (for frontend to check if token is still valid)
const validateToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractToken(authHeader);

        if (!token) {
            return blossomError(res, 'No token provided', 401);
        }

        const decoded = verifyToken(token);

        // Check if user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, username: true, theme: true }
        });

        if (!user) {
            return blossomError(res, 'User no longer exists', 401);
        }

        blossomResponse(res, {
            valid: true,
            user,
            decoded,
            blossom: {
                message: 'Token is valid!',
                emoji: '🌸✅'
            }
        });
    } catch (error) {
        blossomError(res, `Invalid token: ${error.message}`, 401);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    refreshToken,
    getPasswordTipsHandler,
    validateToken
};