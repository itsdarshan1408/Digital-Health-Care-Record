@echo off
echo.
echo =====================================================
echo    Starting HealthSphere Application
echo =====================================================
echo.

cd backend
echo Starting Backend Server...
start cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

cd ../frontend
echo Starting Frontend Server...
start cmd /k "npm run dev"

echo.
echo =====================================================
echo    HealthSphere is starting!
echo    Backend: http://localhost:4000
echo    Frontend: http://localhost:5173
echo =====================================================
echo.
echo Press any key to exit this window...
pause > nul
