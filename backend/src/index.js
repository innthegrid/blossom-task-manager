// Import the express library
const express = require('express');
const cors = require('cors');

// Create an instance of express (the app)
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Basic route
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
        API Root: http://localhost:${PORT}/
        Blossom Endpoint: http://localhost:${PORT}/api/blossom
        Health Check: http://localhost:${PORT}/api/health

        Press CTRL+C to stop the server.
    `);
})