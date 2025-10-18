#!/bin/bash
# AutonomiX Startup Script
# Запускає backend та UI для локальної розробки

set -e

echo "🚀 Starting AutonomiX..."
echo ""

# Kill existing processes
pkill -f "node.*backend" 2>/dev/null || true
pkill -f "http.server 30002" 2>/dev/null || true
sleep 1

# Start backend
echo "📦 Starting Backend (http://localhost:3002)..."
cd "$(dirname "$0")/backend"
npm run dev > /tmp/autonomix-backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend
sleep 3

# Check backend health
if curl -s http://localhost:3002/health > /dev/null 2>&1; then
    echo "   ✅ Backend is healthy"
else
    echo "   ❌ Backend failed to start"
    echo "   Check logs: tail -f /tmp/autonomix-backend.log"
    exit 1
fi

# Start UI
echo ""
echo "🌐 Starting UI (http://localhost:30002)..."
cd "$(dirname "$0")/ui-simple"
python3 -m http.server 30002 > /tmp/autonomix-ui.log 2>&1 &
UI_PID=$!
echo "   UI PID: $UI_PID"

sleep 2

echo ""
echo "✅ AutonomiX is running!"
echo ""
echo "📍 URLs:"
echo "   Backend: http://localhost:3002"
echo "   Frontend: http://localhost:30002"
echo ""
echo "📋 Logs:"
echo "   Backend: tail -f /tmp/autonomix-backend.log"
echo "   UI: tail -f /tmp/autonomix-ui.log"
echo ""
echo "🛑 To stop:"
echo "   kill $BACKEND_PID $UI_PID"
echo "   or: pkill -f 'node.*backend' && pkill -f 'http.server 30002'"
echo ""
echo "🎉 Ready! Open http://localhost:30002 in your browser"
