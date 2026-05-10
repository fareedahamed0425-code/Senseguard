@echo off
echo [SenseGuard AI] Starting Automated Diagnostic Service...

:: Check if node_modules exists
if not exist "frontend\node_modules" (
    echo [!] Dependencies missing. Running setup first...
    call setup.bat
)

:: Start the application
echo [!] Launching SenseGuard AI Core and Dashboard...
npm run dev
pause
