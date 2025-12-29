#!/bin/bash

echo "🌸 Testing Blossom Database Integration 🌸"
echo "=========================================="
echo ""

# Navigate to backend directory if needed
cd "$(dirname "$0")/.."

echo "1. Checking if server is running..."
if ! curl -s http://localhost:5001/api/health > /dev/null; then
    echo "❌ Server is not running on port 5001"
    echo "   Please run: npm run dev"
    exit 1
fi

echo "✅ Server is running"

echo ""
echo "2. Checking database connection via API..."
HEALTH_RESPONSE=$(curl -s http://localhost:5001/api/health)
echo "   Health status: $HEALTH_RESPONSE"

echo ""
echo "3. Getting current tasks..."
TASKS_RESPONSE=$(curl -s http://localhost:5001/api/tasks)
TASK_COUNT=$(echo $TASKS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)
echo "   Found $TASK_COUNT tasks in database"

echo ""
echo "4. Testing task creation (if we have a user ID)..."
if [ -f .env ] && grep -q "TEST_USER_ID" .env; then
    USER_ID=$(grep TEST_USER_ID .env | cut -d'=' -f2)
    echo "   Using test user ID: $USER_ID"
    
    CREATE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/tasks \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Test from script at $(date)\",
        \"description\": \"Created by test-database.sh\",
        \"priority\": \"medium\",
        \"flowerEmoji\": \"🧪\"
      }")
    
    echo "   Creation response: $(echo $CREATE_RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
else
    echo "⚠️  No TEST_USER_ID found in .env file"
    echo "   Run: node src/scripts/seed.js first to create a test user"
fi

echo ""
echo "5. Testing task statistics..."
STATS_RESPONSE=$(curl -s http://localhost:5001/api/tasks/stats)
echo "   Stats: $STATS_RESPONSE"

echo ""
echo "🌸 Database test completed! 🌸"
echo ""
echo "📊 Next steps:"
echo "   - View data in Prisma Studio: npx prisma studio"
echo "   - Run seed script: node src/scripts/seed.js"
echo "   - Check API documentation in README"