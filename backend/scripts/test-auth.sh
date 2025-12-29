#!/bin/bash

echo "🌸 Testing Blossom Authentication 🌸"
echo "===================================="

cd "$(dirname "$0")/.."

echo ""
echo "1. Testing registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "auth_test_'$(date +%s)'@example.com",
    "password": "test123456",
    "username": "AuthTestUser"
  }')

echo "   Response: $(echo $REGISTER_RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"

echo ""
echo "2. Testing login with wrong password..."
WRONG_LOGIN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "blossom@example.com",
    "password": "wrongpassword"
  }')

echo "   Should fail: $(echo $WRONG_LOGIN | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"

echo ""
echo "3. Testing correct login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "blossom@example.com",
    "password": "blossom123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "   Login successful: $(echo $LOGIN_RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
echo "   Token obtained: ${TOKEN:0:20}..."

echo ""
echo "4. Testing protected task endpoint with token..."
if [ ! -z "$TOKEN" ]; then
  TASKS_RESPONSE=$(curl -s http://localhost:5001/api/tasks \
    -H "Authorization: Bearer $TOKEN")
  echo "   Task count: $(echo $TASKS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)"
else
  echo "   ❌ No token obtained"
fi

echo ""
echo "5. Testing profile endpoint..."
PROFILE_RESPONSE=$(curl -s http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN")
echo "   Profile: $(echo $PROFILE_RESPONSE | grep -o '"username":"[^"]*"' | cut -d'"' -f4)"

echo ""
echo "🌸 Authentication test completed! 🌸"