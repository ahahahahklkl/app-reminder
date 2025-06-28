#!/bin/bash

echo "🐳 Deploying AI Reminder Assistant with Docker..."

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Remove old images (optional)
echo "Cleaning up old images..."
docker system prune -f

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

# Show status
echo "Container status:"
docker-compose ps

# Show logs
echo "Recent logs:"
docker-compose logs --tail=20

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:5000/api/reminders"
echo ""
echo "Commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"