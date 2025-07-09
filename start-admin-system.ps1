# Black&Black Admin System Startup Script
Write-Host "🚀 Starting Black&Black Admin System..." -ForegroundColor Green
Write-Host ""

# Function to start backend
function Start-Backend {
    Write-Host "📡 Starting Backend Server..." -ForegroundColor Yellow
    Set-Location "backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "node admin-server.js"
    Set-Location ".."
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting Frontend..." -ForegroundColor Blue
    Set-Location "frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    Set-Location ".."
}

# Start both services
Start-Backend
Start-Sleep -Seconds 2
Start-Frontend

Write-Host ""
Write-Host "✅ Both servers starting..." -ForegroundColor Green
Write-Host "🔗 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 Backend API: http://localhost:5001" -ForegroundColor Cyan
Write-Host "⚙️ Click the Admin button on your site to manage products" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
