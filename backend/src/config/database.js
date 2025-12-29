const { PrismaClient } = require('@prisma/client');

// Create a singleton instance of PrismaClient
// Prevents multiple connections in development
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
});

// Test database connection on startup
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully!');

        // Log database info
        const taskCount = await prisma.task.count();
        const userCount = await prisma.user.count();

        console.log(`Database has ${taskCount} tasks and ${userCount} users.`);
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1); // Exit if the database connection fails
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Database connection closed');
    process.exit(0);
});

module.exports = { prisma, connectDB };