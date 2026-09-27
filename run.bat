@echo off
title Gurukula - Full Stack Development Server
color 0A

echo.
echo ==========================================
echo        GURUKULA - DEVELOPMENT SERVER
echo ==========================================
echo.

set "PROJECT_ROOT=%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not available in PATH.
    echo Please install Node.js 20+ and try again.
    pause
    exit /b 1
)

echo [1/4] Starting Gurukula backend...
start "Gurukula Backend" cmd /k "cd /d "%PROJECT_ROOT%server" && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/4] Starting Gurukula frontend...
start "Gurukula Frontend" cmd /k "cd /d "%PROJECT_ROOT%client" && npm run dev"

timeout /t 5 /nobreak >nul

echo [3/4] Opening Gurukula in your browser...
start "" "http://localhost:5173"

echo [4/4] Startup complete.
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Keep the Backend and Frontend terminal windows open while developing.
echo Close those windows to stop the development servers.
echo.
pause
