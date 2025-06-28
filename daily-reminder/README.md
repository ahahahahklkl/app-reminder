# Daily Reminder App

Aplikasi pengingat harian dengan React frontend dan Node.js backend.

## Fitur
- Input jadwal (hari, jam, aktivitas)
- Simpan/baca jadwal dari SQLite
- Notifikasi browser dan alert popup
- UI minimalis hitam-putih-abu-abu

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Deployment ke EC2

1. Upload files ke EC2
2. Install Node.js dan Nginx
3. Run deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

4. Configure Nginx:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/daily-reminder
sudo ln -s /etc/nginx/sites-available/daily-reminder /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## PM2 Commands
```bash
pm2 list
pm2 restart daily-reminder-backend
pm2 logs daily-reminder-backend
pm2 stop daily-reminder-backend
```