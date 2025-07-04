#!/bin/bash

echo "🚀 Setting up AI Chatbot for Production"

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install nginx certbot python3-certbot-nginx -y

# Setup Nginx config
sudo tee /etc/nginx/sites-available/ai-chatbot << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/ai-chatbot /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Nginx configured!"
echo "📝 Next steps:"
echo "1. Point your domain to this EC2 IP"
echo "2. Replace 'your-domain.com' in /etc/nginx/sites-available/ai-chatbot"
echo "3. Run: sudo certbot --nginx -d your-domain.com"
echo "4. Start your app: docker-compose up -d"