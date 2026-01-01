const { prisma } = require('../config/database');

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

// Get all tasks for a specific user
const getAllTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const { status, priority, categoryId } = req.query;

        const where = { userId };

        if (status && status !== 'all') where.status = status;
        if (priority && priority !== 'all') where.priority = priority;
        if (categoryId && categoryId !== 'all') where.categoryId = categoryId;

        const tasks = await prisma.task.findMany({
            where,
            include: {
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Get statistics
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const overdue = tasks.filter(t => {
            if (!t.dueDate || t.status === 'completed') return false;
            return new Date(t.dueDate) < new Date();
        }).length;

        blossomResponse(res, {
            tasks,
            meta: {
                count: total,
                stats: { total, completed, pending, overdue }
            }
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        blossomError(res, 'Failed to fetch tasks', 500);
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const userId = req.userId;
        const task = await prisma.task.findFirst({
            where: { id: req.params.id, userId },
            include: { category: true }
        });

        if (!task) {
            return blossomError(res, 'Task not found', 404);
        }

        blossomResponse(res, { task });
    } catch (error) {
        console.error('Error fetching task:', error);
        blossomError(res, 'Failed to fetch task', 500);
    }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, categoryId, tags } = req.body;
    const userId = req.userId;

    console.log('Received create request:', { title, userId, categoryId, dueDate }); // Debug

    // Basic validation
    if (!title || title.trim() === '') {
      return blossomError(res, 'Task title is required');
    }

    // Prepare the data
    const taskData = {
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      userId,
      status: 'pending',
      tags: tags || []
    };

    // Handle dueDate
    if (dueDate && dueDate !== '') {
      if (typeof dueDate === 'string' && dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        taskData.dueDate = new Date(dueDate + 'T00:00:00.000Z');
      } else {
        taskData.dueDate = new Date(dueDate);
      }
    }

    // Handle categoryId - convert empty string to null
    if (categoryId && categoryId !== '') {
      // Verify category belongs to user
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId }
      });
      if (!category) {
        return blossomError(res, 'Category not found or access denied', 404);
      }
      taskData.categoryId = categoryId;
    } else {
      taskData.categoryId = null;
    }

    console.log('Task data for creation:', taskData); // Debug

    const task = await prisma.task.create({
      data: taskData,
      include: {
        category: true
      }
    });

    blossomResponse(res, { task }, 'Task created successfully!', 201);
  } catch (error) {
    console.error('Error creating task:', error);
    
    // More detailed error logging
    if (error.code) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error meta:', error.meta);
    }
    
    blossomError(res, `Failed to create task: ${error.message}`, 500);
  }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;
        const updates = req.body;

        console.log('Received update request:', { taskId, userId, updates }); // Debug

        // First check if task exists and belongs to user
        const existing = await prisma.task.findFirst({
            where: { id: taskId, userId }
        });

        if (!existing) {
            return blossomError(res, 'Task not found', 404);
        }

        // Prepare the update data
        const updateData = {};

        // Only include fields that are being updated
        if (updates.title !== undefined) updateData.title = updates.title.trim();
        if (updates.description !== undefined) updateData.description = updates.description.trim();
        if (updates.priority !== undefined) updateData.priority = updates.priority;
        if (updates.status !== undefined) updateData.status = updates.status;

        // Handle dueDate
        if (updates.dueDate !== undefined) {
            if (updates.dueDate === '' || updates.dueDate === null) {
                updateData.dueDate = null;
            } else if (typeof updates.dueDate === 'string' && updates.dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                updateData.dueDate = new Date(updates.dueDate + 'T00:00:00.000Z');
            } else {
                updateData.dueDate = new Date(updates.dueDate);
            }
        }

        // Handle categoryId - convert empty string to null
        if (updates.categoryId !== undefined) {
            if (updates.categoryId === '' || updates.categoryId === null) {
                updateData.categoryId = null;
            } else {
                updateData.categoryId = updates.categoryId;

                // Verify category belongs to user if it's being set
                const category = await prisma.category.findFirst({
                    where: { id: updates.categoryId, userId }
                });
                if (!category) {
                    return blossomError(res, 'Category not found or access denied', 404);
                }
            }
        }

        // Handle tags
        if (updates.tags !== undefined) {
            updateData.tags = updates.tags || [];
        }

        console.log('Update data to send to Prisma:', updateData); // Debug

        const task = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
            include: {
                category: true
            }
        });

        blossomResponse(res, { task }, 'Task updated successfully!');
    } catch (error) {
        console.error('Error updating task:', error);

        // More detailed error logging
        if (error.code) {
            console.error('Prisma error code:', error.code);
            console.error('Prisma error meta:', error.meta);
        }

        blossomError(res, `Failed to update task: ${error.message}`, 500);
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;

        // First check if task exists and belongs to user
        const existing = await prisma.task.findFirst({
            where: { id: taskId, userId }
        });

        if (!existing) {
            return blossomError(res, 'Task not found', 404);
        }

        await prisma.task.delete({
            where: { id: taskId }
        });

        blossomResponse(res, {}, 'Task deleted successfully!');
    } catch (error) {
        console.error('Error deleting task:', error);
        blossomError(res, 'Failed to delete task', 500);
    }
};

// Get task statistics
const getTaskStats = async (req, res) => {
    try {
        const userId = req.userId;

        const tasks = await prisma.task.findMany({
            where: { userId }
        });

        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'completed').length,
            pending: tasks.filter(t => t.status === 'pending').length,
            overdue: tasks.filter(t => {
                if (!t.dueDate || t.status === 'completed') return false;
                return new Date(t.dueDate) < new Date();
            }).length,
            highPriority: tasks.filter(t => t.priority === 'high').length,
            mediumPriority: tasks.filter(t => t.priority === 'medium').length,
            lowPriority: tasks.filter(t => t.priority === 'low').length
        };

        blossomResponse(res, { stats }, 'Statistics retrieved successfully!');
    } catch (error) {
        console.error('Error getting stats:', error);
        blossomError(res, 'Failed to get statistics', 500);
    }
};

// Toggle task completion
const toggleTask = async (req, res) => {
    try {
        const userId = req.userId;
        const taskId = req.params.id;
        const { completed } = req.body;

        // Check if task exists and belongs to user
        const task = await prisma.task.findFirst({
            where: { id: taskId, userId }
        });

        if (!task) {
            return blossomError(res, 'Task not found', 404);
        }

        const newStatus = completed ? 'completed' : 'pending';

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status: newStatus },
            include: { category: true }
        });

        blossomResponse(res, {
            task: updatedTask,
            message: newStatus === 'completed' ? 'Task completed!' : 'Task marked as pending'
        });
    } catch (error) {
        console.error('Error toggling task:', error);
        blossomError(res, 'Failed to toggle task status', 500);
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    toggleTask
};