const { prisma } = require('../config/database');
const { hashPassword } = require('../utils/password');

async function seedDatabase() {
  console.log('🌸 Starting database seed...');

  try {
    // Clear existing data
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});

    // Hash password before creating user
    const hashedPassword = await hashPasword('blossom123');

    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'blossom@example.com',
        password: hashedPassword,
        username: 'CherryBlossomFan',
        theme: 'cherry-blossom'
      }
    });

    console.log(`🌸 Created user: ${user.email} (ID: ${user.id})`);
    console.log(`🌸 Test password: blossom123`);

    // Create some sample tasks for the user
    const sampleTasks = [
      {
        title: 'Water the cherry blossom tree',
        description: 'It needs hydration to bloom beautifully',
        priority: 'high',
        status: 'pending',
        flowerEmoji: '💧',
        userId: user.id
      },
      {
        title: 'Plan cherry blossom viewing party',
        description: 'Invite friends for hanami (flower viewing)',
        priority: 'medium',
        status: 'pending',
        flowerEmoji: '🌸',
        userId: user.id
      },
      {
        title: 'Learn about sakura varieties',
        description: 'Research different types of cherry blossoms',
        priority: 'low',
        status: 'completed',
        flowerEmoji: '📚',
        userId: user.id
      },
      {
        title: 'Buy gardening tools',
        description: 'Pruning shears and watering can for blossom care',
        priority: 'high',
        status: 'pending',
        flowerEmoji: '🛒',
        userId: user.id
      },
      {
        title: 'Design Blossom app logo',
        description: 'Create cherry blossom themed logo for our app',
        priority: 'medium',
        status: 'in-progress',
        flowerEmoji: '🎨',
        userId: user.id
      }
    ];

    // Create all tasks
    for (const taskData of sampleTasks) {
      const task = await prisma.task.create({
        data: taskData
      });
      console.log(`Created task: ${task.title}`);
    }

    console.log(`
    🌸 Database seeded successfully!
    
    User ID to use in API calls: ${user.id}
    Test email: blossom@example.com
    
    You can now:
    1. Get tasks: curl http://localhost:5001/api/tasks?userId=${user.id}
    2. Try creating your own tasks with userId=${user.id}
    `);

  } catch (error) {
    console.error('🍂 Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDatabase();