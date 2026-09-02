@echo off
title KrushiMitra - Smart Agriculture Platform
echo ========================================================
echo        KrushiMitra - Smart Agriculture Platform
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python Backend...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing/verifying backend dependencies...
pip install -r requirements.txt

echo.
echo [2/3] Checking Frontend Dependencies...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend packages (first run only, please wait)...
    call npm install
)

echo.
echo [3/3] Launching KrushiMitra Services...
echo Starting Flask API Backend on port 5000...
start "KrushiMitra Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python app.py"

timeout /t 3 >nul

echo Starting React Vite Frontend on port 5173...
start "KrushiMitra Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo  KrushiMitra is launching!
echo  Frontend will open in your browser: http://localhost:5173
echo ========================================================
timeout /t 4 >nul
start http://localhost:5173
exit
