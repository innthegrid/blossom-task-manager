const { tasks, generateId, Task } = require('../models/Task');

// Helper function to respond with blossom-themed errors
const blossomError = (res, message, status = 400) => {
    res.status(status).json({
        error: message,
        suggestion: 'Keep calm and blossom on!',
        status: 'error'
    });
};

// Helper function for success responses
const blossomSuccess = (res, data, message = 'Success!', status = 200) => {
    res.status(status).json({
        ...data,
        message,
        status: 'success'
    });
};

// Get all tasks for a specific user
const getAllTasks = (req, res) => {
    try {
        // In real practice, we would get userId from auth token
        // For now, we will use a hardcoded userId from query params
        const userId = req.query.userId || 'user123';

        const userTasks = tasks.filter(task => task.userId === userId);

        blossomSuccess(res, {
            tasks: userTasks,
            count: userTasks.length,
            userId,
            petalCount: userTasks.length
        }), 'Found ${userTasks.length} petals in your garden!';
    } catch (error) {
        blossomError(res, 'Failed to fetch tasks', 500);
    }
};

// Get a single task by ID
const getTaskById = (req, res) => {
    try {
        const task = tasks.find(t => t.id === req.params.id);

        if (!task) {
            return blossomError(res, 'Task not found - petal has fallen!', 404);
        }

        blossomSuccess(res, {
            task,
            flower: '🌸',
            status: 'Petal found!'
        });
    } catch (error) {
        blossomError(res, 'Failed to fetch task', 500);
    }
};

// Create a new task
const createTask = (req, res) => {
    try {
        const { title, description, priority = 'medium', dueDate } = req.body;

        // Basic validation
        if (!title || title.trim() === '') {
            return blossomError(res, 'Task title is required - every petal needs a name!');
        }

        const newTask = new Task(
            generateId(),
            title.trim(),
            description || '',
            'user123', // hardcoded for now, will come from auth later
            'pending',
            priority,
            dueDate ? new Date(dueDate) : null
        );

        tasks.push(newTask);

        blossomSuccess(res, {
            task: newTask,
            petalAdded: true,
            totalPetals: tasks.filter(t => t.userId === 'user123').length
        }, 'New petal added to your blossom!', 201);
    } catch (error) {
        blossomError(res, 'Failed to create task', 500);
    }
};

// Update a task
const updateTask = (req, res) => {
    try {
        const taskId = req.params.id;
        const updates = req.body;

        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) {
            return blossomError(res, 'Task not found - petal has fallen!', 404);
        }

        // Update the task
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date()
        };

        blossomSuccess(res, {
            task: tasks[taskIndex],
            updated: true,
            blossomStatus: 'Petal refreshed!'
        });
    } catch (error) {
        blossomError(res, 'Failed to update task', 500);
    }
};

// Delete a task
const deleteTask = (req, res) => {
    try {
        const taskId = req.params.id;
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) {
            return blossomError(res, 'Task not found - petal has already fallen!', 404);
        }

        const deletedTask = tasks[taskIndex];
        tasks.splice(taskIndex, 1);

        blossomSuccess(res, {
            deletedTask,
            remainingPetals: tasks.filter(t => t.userId === 'user123').length,
            message: 'Petal released to blossom again elsewhere'
        });
    } catch (error) {
        blossomError(res, 'Failed to delete task', 500);
    }
};

// Export all controller functions
module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};