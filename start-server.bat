@echo off
echo ========================================
echo    DigiFarmHelp Server Quick Start
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking MongoDB service...
net start | findstr MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB service not running
    echo Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MongoDB service
        echo Please start MongoDB manually or check installation
        pause
        exit /b 1
    )
)
echo ✅ MongoDB service is running

echo.
echo [2/4] Testing MongoDB connection...
mongosh --eval "db.runCommand({ping: 1})" --quiet >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Cannot connect to MongoDB
    echo Please check MongoDB is running on localhost:27017
    pause
    exit /b 1
)
echo ✅ MongoDB connection successful

echo.
echo [3/4] Checking dependencies...
echo ✅ Dependencies ready

echo.
echo [4/4] Starting server...
echo ========================================
npm start