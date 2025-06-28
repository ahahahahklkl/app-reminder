@echo off
echo 🐳 Deploying AI Reminder Assistant with Docker...

echo Stopping existing containers...
docker-compose down

echo Cleaning up old images...
docker system prune -f

echo Building and starting containers...
docker-compose up --build -d

echo Container status:
docker-compose ps

echo Recent logs:
docker-compose logs --tail=20

echo.
echo ✅ Deployment complete!
echo 🌐 Frontend: http://localhost
echo 🔧 Backend API: http://localhost:5000/api/reminders
echo.
echo Commands:
echo   View logs: docker-compose logs -f
echo   Stop: docker-compose down
echo   Restart: docker-compose restart

pause