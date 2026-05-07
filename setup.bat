@echo off
echo [SenseGuard AI] Initializing Hackathon MVP Setup...

:: Backend Setup
echo [1/3] Setting up Python Environment...
python -m venv venv
call venv\Scripts\activate
pip install -r backend/requirements.txt

:: Frontend Setup
echo [2/3] Setting up Frontend Dependencies...
cd frontend
npm install

:: Final Steps
echo [3/3] Setup Complete!
echo.
echo To run SenseGuard AI:
echo 1. Open two terminals
echo 2. Terminal 1: cd frontend ^&^& npm run dev
echo 3. Terminal 2: cd frontend ^&^& npm run electron
echo.
echo SenseGuard AI Core will be automatically started by Electron.
pause
