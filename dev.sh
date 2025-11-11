#!/bin/bash
# Local development server script

echo "🚀 Starting local development server..."
echo "📍 Server will be available at: http://localhost:8000"
echo "📝 Press Ctrl+C to stop the server"
echo ""

# Use npx to run http-server (no npm install needed)
npx -y http-server -p 8000 -o -c-1

