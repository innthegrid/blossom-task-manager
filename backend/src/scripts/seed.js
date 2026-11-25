require('dotenv').config();

const { Prisma } = require('@prisma/client');
const { prisma } = require('../config/database');
const { hashPassword, validatePassword } = require('../utils/password');

const sampleTasks = [
  {
    title: 'Water the cherry blossom tree',
    description: 'It needs hydration to bloom beautifully',
    priority: 'high',
    flowerEmoji: '💧'
  },
  {
    title: 'Plan a cherry blossom viewing party',
    description: 'Invite friends for hanami (flower viewing)',
    subtasks: { create: [{ title: 'Pick a date', completed: true }, { title: 'Send invitations' }] }
  },
  {
    title: 'Learn about sakura varieties',
    priority: 'low',
    status: 'completed',
    flowerEmoji: '📚'
  },
  {
    title: 'Buy gardening tools',
    description: 'Pruning shears and a watering can',
    priority: 'high',
    flowerEmoji: '🛒'
  },
  {
    title: 'Design the Blossom app logo',
    status: 'archived',
    flowerEmoji: '🎨'
  }
];

async function seedDatabase() {
  const email = process.env.DEMO_EMAIL?.trim() || 'blossom@example.com';
  const password = process.env.DEMO_PASSWORD;
  const validation = validatePassword(password);

  if (!validation.isValid) {
    throw new Error(`Set a valid DEMO_PASSWORD. ${validation.errors.join('. ')}.`);
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        username: 'CherryBlossomFan',
        tasks: { create: sampleTasks }
      }
    });
    console.log(`Created the demo account ${email} with ${sampleTasks.length} sample tasks.`);
  } catch (error) {
    // Creating the user and tasks together rolls them all back if the email already exists.
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' && error.meta?.target?.includes('email')) {
      console.log(`An account already exists for ${email}. No changes made.`);
      return;
    }
    throw error;
  }
}

seedDatabase()
  .catch((error) => {
    console.error(`Demo seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
