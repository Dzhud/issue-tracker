#!/bin/bash

# Start backend and frontend servers

echo "Starting Issue Tracker Application..."
echo "======================================"

# Check if database is running
echo "Checking PostgreSQL connection..."
psql -U postgres -c "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi
echo "✓ PostgreSQL is running"

# Start backend
echo ""
echo "Starting backend server..."
cd backend
npm run build > /dev/null 2>&1
node dist/index.js &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID) - http://localhost:5000"

# Wait for backend to start
sleep 2

# Start frontend
echo ""
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID) - http://localhost:3000"

echo ""
echo "======================================"
echo "✓ Issue Tracker is running!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "API Docs: See README.md for API endpoints"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "======================================"

# Wait for both processes
wait
