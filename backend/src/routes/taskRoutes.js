const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Blossom-themed middleware for logging
const blossomLogger = (req, res, next) => {
    console.log(`🌸 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

// Apply blossom logger to all task routes
router.use(blossomLogger);

// Get all tasks (with optional user filter)
router.get('/', taskController.getAllTasks);

// Get task statistics
router.get('/stats', taskController.getTaskStats);

// Get a specific task by ID
router.get('/:id', taskController.getTaskById);

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Special blossom-themed endpoint
router.get('/garden/blossoms', (req, res) => {
    res.json({
        message: 'Welcome to your cherry blossom garden!',
        petals: ['Create', 'Read', 'Update', 'Delete'],
        gardenSize: 'Growing every day!',
        tip: 'Grow your goals, one petal at a time.',
        database: 'PostgreSQL + Prisma'
    });
});

module.exports = router;