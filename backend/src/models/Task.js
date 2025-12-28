// Task model - defines what a task is
// Temporarily using an in-memory array (will replace with a database later)

class Task {
    constructor(id, title, description = '', userId, status = 'pending', priority = 'medium', dueDate = null) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId; // Which user owns this task
        this.status = status; // 'pending', 'completed'
        this.priority = priority; // 'low', 'medium', 'high'
        this.dueDate = dueDate; // Optional due date
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

// In-memory storage (temporary - will be replaced with a database)
const tasks = [
    // Sample tasks for testing
    new Task('1', 'Plan cherry blossom viewing', 'Find best spots in the city', 'user123', 'pending', 'medium', new Date('2024-04-10')),
    new Task('2', 'Buy gardening tools', 'Pruning shears and watering can', 'user123', 'completed', 'high'),
    new Task('3', 'Learn full-stack development', 'Build Blossom task manager', 'user123', 'pending', 'high'),
    new Task('4', 'Design Blossom logo', 'Create cherry blossom themed logo', 'user456', 'pending', 'low'),
];

// Helper function to generate unique IDs (temporary)
let currentId = 5;
const generateId = () => (currentId++).toString();

// Export the model and temporary storage
module.exports = {
    Task,
    tasks,
    generateId
};