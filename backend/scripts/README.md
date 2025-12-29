# 🔧 Development Scripts

This directory contains utility scripts for development and testing.

## 📋 Available Scripts

### `test-database.sh`
Tests the database connection and basic CRUD operations.

**Usage:**
```bash
./scripts/test-database.sh
```

**Prerequisites:**
1. Server must be running: `npm run dev`
2. Database must be seeded: `node src/scripts/seed.js`

### Running via npm
Add to `package.json` scripts:
```json
"scripts": {
  "test:db": "./scripts/test-database.sh",
  "seed": "node src/scripts/seed.js"
}
```

Then run:
```bash
npm run test:db
```

## 🗃️ Seed Script

### `src/scripts/seed.js`
Populates the database with sample data for development.

**Usage:**
```bash
node src/scripts/seed.js
```

**What it creates:**
- 1 test user (blossom@example.com)
- 5 sample tasks with cherry blossom theme
- Prints the user ID for API testing

## 🧪 Testing Workflow

1. **Start the database:** `brew services start postgresql`
2. **Run migrations:** `npx prisma migrate dev`
3. **Seed data:** `npm run seed`
4. **Start server:** `npm run dev`
5. **Test API:** `npm run test:db`

## 🔍 Database Tools

- **Prisma Studio:** `npx prisma studio` (GUI at http://localhost:5555)
- **PostgreSQL CLI:** `psql -d blossom_db -U blossom_user`
- **Reset database:** `npx prisma migrate reset`
```