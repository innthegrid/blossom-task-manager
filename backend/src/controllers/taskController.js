const { TaskRepository } = require('../models/Task');

// Helper function to respond with blossom-themed errors
const blossomError = (res, message, status = 400) => {
    res.status(status).json({
        error: message,
        suggestion: 'Try again with valid data, petal!',
        status: 'error',
        timestamp: new Date().toISOString()
    });
};

// Helper function for success responses
const blossomSuccess = (res, data, message = 'Success!', status = 200) => {
    res.status(status).json({
        data,
        message,
        status: 'success',
        timestamp: new Date().toISOString()
    });
};

// Get all tasks for a specific user
const getAllTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const { status, priority, includeUser } = req.query;

        const tasks = await TaskRepository.findAll(userId, {
            status,
            priority,
            includeUser: includeUser === 'true'
        });

        // Get statistics for the response
        const stats = await TaskRepository.getStats(userId);

        blossomSuccess(res, {
            tasks,
            meta: {
                count: tasks.length,
                userId,
                ...stats
            },
            blossom: {
                petals: tasks.length,
                garden: 'blooming',
            }
        }, `Found ${tasks.length} petals in your garden!`);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        blossomError(res, 'Failed to fetch tasks', 500);
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const userId = req.userId;
        const task = await TaskRepository.findById(req.params.id, userId);

        if (!task) {
            return blossomError(res, 'Task not found - petal has fallen!', 404);
        }

        blossomSuccess(res, {
            task,
            blossom: {
                emoji: task.flowerEmoji || '🌸',
                isBlossom: task.isBlossom
            }
        }, 'Petal found in your garden!');
    } catch (error) {
        console.error('Error fetching task:', error);
        blossomError(res, 'Failed to fetch task', 500);
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, flowerEmoji } = req.body;
        const userId = req.userId;

        const taskData = {
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId,
            flowerEmoji
        };

        const task = await TaskRepository.create(taskData);

        // Get updated statistics
        const stats = await TaskRepository.getStats(userId);

        blossomSuccess(res, {
            task,
            meta: {
                totalPetals: stats.total,
                newPetal: true
            }
        }, 'New petal added to your blossom!', 201);
    } catch (error) {
        console.error('Error creating task:', error);

        if (error.message.startsWith('Validation failed')) {
            blossomError(res, error.message, 400);
        } else {
            blossomError(res, 'Failed to create task', 500);
        }
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;
        const updates = req.body;

        const task = await TaskRepository.update(taskId, userId, updates);

        blossomSuccess(res, {
            task,
            blossom: {
                status: 'refreshed',
                emoji: '💦🌸'
            }
        }, 'Petal refreshed!');
    } catch (error) {
        console.error('Error updating task:', error);

        if (error.message.includes('not found')) {
            blossomError(res, error.message, 404);
        } else if (error.message.startsWith('Validation failed')) {
            blossomError(res, error.message, 400);
        } else {
            blossomError(res, 'Failed to update task', 500);
        }
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;

        const deletedTask = await TaskRepository.delete(taskId, userId);

        // Get updated statistics
        const stats = await TaskRepository.getStats(userId);

        blossomSuccess(res, {
            deletedTask,
            meta: {
                remainingPetals: stats.total,
                gardenStatus: 'still blooming'
            }
        }, 'Petal released to blossom again elsewhere!');
    } catch (error) {
        console.error('Error deleting task:', error);
        
        if (error.message.includes('not found')) {
            blossomError(res, error.message, 404);
        } else {
            blossomError(res, 'Failed to delete task', 500);
        }
    }
};

// Get task statistics
const getTaskStats = async (req, res) => {
    try {
        const userId = req.userId;
        const stats = await TaskRepository.getStats(userId);

        blossomSuccess(res, {
            stats,
            blossom: {
                gardenHealth: stats.completionRate > 50 ? 'thriving' : 'needs care',
                recommendation: stats.highPriority > 0 ?
                    `Focus on ${stats.highPriority} high priority petals` :
                    'Your garden is balanced!'
            }
        }, 'Garden statistics gathered!');
    } catch (error) {
        console.error('Error getting stats:', error);
        blossomError(res, 'Failed to get statistics', 500);
    }
};

// Export all controller functions
module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
};