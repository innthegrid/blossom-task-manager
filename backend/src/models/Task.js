// Task model - defines what a task is
// Uses Prisma with PostgreSQL

const { prisma } = require('../config/database');

// Task model class (for data validation and transformation)
class TaskModel {
    constructor(data) {
        this.title = data.title;
        this.description = data.description || '';
        this.status = data.status || 'pending';
        this.priority = data.priority || 'medium';
        this.dueDate = data.dueDate || null;
        this.userId = data.userId;
        this.flowerEmoji = data.flowerEmoji || '🌸';
        this.isBlossom = data.isBlossom !== false; // default to true
    }

    // Validate task data
    validate() {
        const errors = [];

        if (!this.title || this.title.trim() === '') {
            errors.push('Title is required.');
        }

        if (this.title && this.title.length > 200) {
            errors.push('Title must be less than 200 characters.');
        }

        if (!['pending', 'in-progress', 'completed'].includes(this.status)) {
            errors.push('Status must be pending, in-progress, or completed.');
        }

        if (!['low', 'medium', 'high'].includes(this.priority)) {
            errors.push('Priority must be low, medium, or high.');
        }

        return errors;
    }

    // Convert to database format
    toDatabase() {
        return {
            title: this.title.trim(),
            description: this.description,
            status: this.status,
            priority: this.priority,
            dueDate: this.dueDate,
            userId: this.userId,
            flowerEmoji: this.flowerEmoji,
            isBlossom: this.isBlossom
        };
    }

    // Convert from database format
    static fromDatabase(dbTask) {
        return {
            id: dbTask.id,
            title: dbTask.title,
            description: dbTask.description,
            status: dbTask.status,
            priority: dbTask.priority,
            dueDate: dbTask.dueDate,
            userId: dbTask.userId,
            flowerEmoji: dbTask.flowerEmoji,
            isBlossom: dbTask.isBlossom,
            createdAt: dbTask.createdAt,
            updatedAt: dbTask.updatedAt,
            // Include user if it was fetched with the task
            user: dbTask.user ? {
                id: dbTask.user.id,
                email: dbTask.user.email,
                username: dbTask.user.username
            } : undefined
        };
    }
}

// Database operations
const TaskRepository = {
    // Get all tasks for a user
    async findAll(userId, options = {}) {
        const { includeUser = false, status, priority } = options;

        const where = { userId };

        if (status) where.status = status;
        if (priority) where.priority = priority;

        const tasks = await prisma.task.findMany({
            where,
            include: { user: includeUser },
            orderBy: {createdAt: 'desc' }
        });

        return tasks.map(TaskModel.fromDatabase);
    },

    // Get task by ID
    async findById(id, userId) {
        const task = await prisma.task.findFirst({
            where: { id, userId }
        });

        return task ? TaskModel.fromDatabase(task) : null;
    },

    // Create task
    async create(taskData) {
        const taskModel = new TaskModel(taskData);
        const errors = taskModel.validate();

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }

        const dbTask = await prisma.task.create({
            data: taskModel.toDatabase()
        });

        return TaskModel.fromDatabase(dbTask);
    },

    // Update task
    async update(id, userId, updates) {
        // First check if task exists and belongs to user
        const existing = await prisma.task.findFirst({
            where: { id, userId }
        });

        if (!existing) {
            throw new Error('Task not found or access denied.');
        }

        // Merge updates with existing data and validate
        const updatedData = { ...existing, ...updates };
        const taskModel = new TaskModel(updatedData);
        const errors = taskModel.validate();

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }

        const dbTask = await prisma.task.update({
            where:{ id },
            data: taskModel.toDatabase()
        });

        return TaskModel.fromDatabase(dbTask);
    },

    // Delete task
    async delete(id, userId) {
        // First check if task exists and belongs to user
        const existing = await prisma.task.findFirst({
            where: { id, userId }
        });

        if (!existing) {
            throw new Error('Task not found or access denied.');
        }

        await prisma.task.delete({
            where: { id }
        });

        return TaskModel.fromDatabase(existing);
    },

    // Statistics
    async getStats(userId) {
        const total = await prisma.task.count({ where: { userId } });
        const completed = await prisma.task.count({
            where: { userId, status: 'completed' }
        });
        const pending = await prisma.task.count({
            where: { userId, priority: 'high' }
        });
        const highPriority = await prisma.task.count({
            where: { userId, priority: 'high'}
        })

        return {
            total,
            completed,
            pending,
            highPriority,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
};

module.exports = { TaskModel, TaskRepository };