@echo off
echo 🚀 Setting up Black&Black Admin System...
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ✅ Setup complete!
echo.
echo 🎯 To start the admin system:
echo 1. Backend: cd backend && npm run admin-dev
echo 2. Frontend: cd frontend && npm run dev
echo.
echo 🔗 Access admin panel at: http://localhost:3000 (click the ⚙️ Admin button)
echo 🔗 Backend API at: http://localhost:5001
echo.
pause
