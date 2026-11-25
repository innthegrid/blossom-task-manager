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

## Demo data

Follow [the demo setup instructions](../../README.md#optional-demo-data) to
create an account with sample tasks. The seed command preserves existing data.

## 🔍 Database Tools

- **Prisma Studio:** `npx prisma studio` (GUI at http://localhost:5555)
- **PostgreSQL CLI:** `psql -d blossom_db -U blossom_user`
- **Reset database:** `npx prisma migrate reset`
```
## Automated API integration tests

From `backend/`, set `TEST_DATABASE_URL` to a dedicated PostgreSQL test database,
then run:

```bash
DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy
npm run generate
npm test
```

The tests start the Express app on an ephemeral port and clean up the accounts
they create. GitHub Actions runs them against PostgreSQL on pushes and pull
requests.
