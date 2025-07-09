#!/bin/bash

echo "🚀 Setting up Black&Black Admin System..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the admin system:"
echo "1. Backend: cd backend && npm run admin-dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "🔗 Access admin panel at: http://localhost:3000 (click the ⚙️ Admin button)"
echo "🔗 Backend API at: http://localhost:5001"
