#!/bin/bash

# Script to seed the MongoDB database
# Make sure your Next.js app is running first!

echo "🌱 Seeding MongoDB database..."
echo ""

# Check if Next.js is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Error: Next.js app is not running!"
    echo "   Please start it first with: yarn dev"
    exit 1
fi

# Make POST request to seed endpoint
response=$(curl -s -X POST http://localhost:3000/api/seed -w "\n%{http_code}")

# Extract status code (last line)
status_code=$(echo "$response" | tail -n1)
# Extract body (all but last line)
body=$(echo "$response" | head -n-1)

if [ "$status_code" = "200" ]; then
    echo "✅ Database seeded successfully!"
    echo "$body" | grep -o '"message":"[^"]*"' | sed 's/"message":"\([^"]*\)"/\1/'
else
    echo "❌ Error seeding database (Status: $status_code)"
    echo "$body"
    exit 1
fi

