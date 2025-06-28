# 🖥️ VM Setup Instructions

## 📋 Prerequisites

### Install Docker di VM:

**Ubuntu/Debian VM:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again
```

**Windows VM (dengan WSL2):**
```powershell
# Install Docker Desktop
# Download dari: https://www.docker.com/products/docker-desktop

# Atau via Chocolatey
choco install docker-desktop
```

## 🚀 Deploy Steps

### 1. Copy Project ke VM
```bash
# Via shared folder, USB, atau git clone
cp -r /path/to/daily-reminder ~/
cd ~/daily-reminder
```

### 2. Deploy
```bash
# Linux VM
chmod +x deploy-docker.sh
./deploy-docker.sh

# Windows VM
deploy-docker.bat
```

### 3. Access Application
- **Frontend**: http://localhost
- **Backend**: http://localhost:5000

## 🔧 VM Network Settings

**Jika ingin akses dari host machine:**

### VirtualBox:
1. VM Settings → Network
2. Adapter 1: NAT
3. Advanced → Port Forwarding
4. Add rules:
   - Host Port 8080 → Guest Port 80 (Frontend)
   - Host Port 8081 → Guest Port 5000 (Backend)

### VMware:
1. VM Settings → Network Adapter
2. NAT mode
3. Port forwarding sama seperti VirtualBox

**Access dari host:** http://localhost:8080

## 🐳 Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all
docker-compose down

# Restart
docker-compose restart

# Rebuild
docker-compose up --build -d
```

## 🔍 Troubleshooting

**Port already in use:**
```bash
# Check what's using port 80
sudo lsof -i :80
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>
```

**Permission denied:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

**Container won't start:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
```