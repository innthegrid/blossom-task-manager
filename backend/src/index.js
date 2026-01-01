// Load environment variables
require('dotenv').config();

// Import the express library
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Create an instance of express (the app)
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
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

// Set the port (use environment variable or default to 3000)
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
    console.log(`
        Blossom server is blooming on port ${PORT}!

        Welcome to your task manager backend
        Local: http://localhost:${PORT}

        Available endpoints:
        API Root: http://localhost:${PORT}/
        Tasks: http://localhost:${PORT}/api/tasks
        Auth: http://localhost:${PORT}/api/auth
        Stats: http://localhost:${PORT}/api/tasks/stats
        Blossom: http://localhost:${PORT}/api/blossom
        Health: http://localhost:${PORT}/api/health
        Garden: http://localhost:${PORT}/api/tasks/garden/blossoms

        Database: PostgreSQL + Prisma
        Auth: JWT Tokens
        Theme: Cherry Blossom

        Press CTRL+C to stop the server.
    `);
})