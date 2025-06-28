#!/bin/bash

# Install dependencies
echo "Installing backend dependencies..."
cd backend && npm install

echo "Installing frontend dependencies..."
cd ../frontend && npm install

# Build frontend
echo "Building frontend..."
npm run build

# Install PM2 globally if not installed
echo "Installing PM2..."
npm install -g pm2

# Start backend with PM2
echo "Starting backend with PM2..."
cd ..
pm2 start ecosystem.config.js

# Copy nginx config (manual step)
echo "Copy nginx.conf to /etc/nginx/sites-available/ and enable it"
echo "sudo cp nginx.conf /etc/nginx/sites-available/daily-reminder"
echo "sudo ln -s /etc/nginx/sites-available/daily-reminder /etc/nginx/sites-enabled/"
echo "sudo nginx -t && sudo systemctl reload nginx"

echo "Deployment complete!"
echo "Backend running on port 5000"
echo "Frontend build ready for nginx"