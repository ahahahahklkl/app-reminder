# 🤖 AI Reminder Assistant - Docker VM Deployment

## 🚀 Quick Start (VM)

```bash
# Copy project folder to VM
# Make sure Docker and Docker Compose are installed in VM

# Navigate to project directory
cd daily-reminder

# Deploy (Linux/Mac VM)
chmod +x deploy-docker.sh
./deploy-docker.sh

# Deploy (Windows VM)
docker-compose up --build -d
```

## 🐳 Manual Docker Commands

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Restart services
docker-compose restart

# View container status
docker-compose ps
```

## 📁 Project Structure

```
daily-reminder/
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/App.js
├── docker-compose.yml
└── deploy-docker.sh
```

## 🌐 Access Points (dari Host/VM)

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:5000  
- **Health Check**: http://localhost/api/reminders

**Jika VM dengan port forwarding:**
- Frontend: http://VM-IP:80
- Backend: http://VM-IP:5000

## 💾 Data Persistence

SQLite database stored in `./data/` directory (auto-created)

## 🔧 Environment Variables

- `NODE_ENV=production`
- `PORT=5000`

## 📊 Monitoring

```bash
# Container stats
docker stats

# Container health
docker-compose ps
```