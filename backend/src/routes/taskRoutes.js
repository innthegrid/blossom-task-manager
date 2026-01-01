const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

// Apply authentication to all task routes
router.use(authenticate);

// Get all tasks (with optional filters)
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

// Toggle task completion
router.patch('/:id/toggle', taskController.toggleTask);

module.exports = router;