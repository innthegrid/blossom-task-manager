// Load environment variables
require('dotenv').config();

// Import the express library
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Create an instance of express (the app)
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN?.trim() || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parse JSON request bodies

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Blossom Task Manager API!',
        version: '1.0.0',
        endpoints: {
            tasks: '/api/tasks',
            users: '/api/users',
            auth: 'api/auth'
        },
        theme: 'cherry-blossom',
        motto: 'Grow your goals, one petal at a time.'
    });
});

// Blossom test endpoint
app.get('/api/blossom', (req, res) => {
    res.json({
        message: 'Hello from Blossom!',
        petals: ['Create', 'Read', 'Update', 'Delete'],
        colors: {
            primary: '#FFB7C5',
            secondary: '#D4A5A5',
            accent: '#FFF9FB'
        },
        features: 'Coming soon: Task management with cherry blossom elegance!'
    });
});

// Health check endpoint (for monitoring)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'blossom-backend'
    });
});

if (require.main === module) {
    const port = process.env.PORT || 5001;
    connectDB().then(() => {
        app.listen(port, () => console.log(`Blossom API listening on port ${port}`));
    });
}

module.exports = app;
