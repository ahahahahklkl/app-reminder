# 🤖 AI Teman Belajar

Aplikasi tanya jawab sederhana dengan AI yang user-friendly untuk anak sekolah.

## ✨ Fitur

- 🤖 **Chat dengan AI**: Tanya jawab dengan OpenAI GPT atau Google Gemini
- 📚 **Ramah Anak**: Interface yang colorful dan mudah digunakan
- 📜 **Riwayat Chat**: Simpan dan lihat percakapan sebelumnya
- 💡 **Tips Bertanya**: Panduan cara bertanya yang baik
- 📱 **Responsive**: Bisa digunakan di desktop dan mobile
- 🔒 **Aman**: API key tersimpan dengan aman

## 🚀 Cara Menjalankan

### 1. Persiapan

```bash
# Clone atau download project
cd ai-chatbot

# Install dependencies
pip install -r requirements.txt
```

### 2. Konfigurasi API Key

```bash
# Copy file .env.example ke .env
cp .env.example .env

# Edit file .env dan isi API key
# Untuk OpenAI: https://platform.openai.com/api-keys
# Untuk Gemini: https://makersuite.google.com/app/apikey
```

### 3. Jalankan Aplikasi

```bash
# Jalankan aplikasi
python app.py

# Buka browser: http://localhost:5000
```

## 🐳 Deploy dengan Docker

```bash
# Build dan jalankan
docker-compose up --build

# Akses: http://localhost:5000
```

## ☁️ Deploy ke AWS EC2

### 1. Setup EC2 Instance

```bash
# Launch EC2 instance (Ubuntu 20.04 LTS)
# Security Group: Allow port 80, 443, 22, 5000

# Connect ke EC2
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu

# Install Git
sudo apt install git -y

# Logout dan login kembali
exit
```

### 3. Deploy Aplikasi

```bash
# Clone project
git clone <your-repo-url>
cd ai-chatbot

# Setup environment
cp .env.example .env
nano .env  # Edit API keys

# Build dan jalankan
docker-compose up -d

# Setup Nginx (optional)
sudo apt install nginx -y
```

### 4. Setup Nginx (Production)

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/ai-chatbot
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ai-chatbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Konfigurasi

### Environment Variables (.env)

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Gemini API Key  
GEMINI_API_KEY=your_gemini_api_key_here

# AI Provider (openai atau gemini)
AI_PROVIDER=openai
```

### Mendapatkan API Key

#### OpenAI GPT
1. Buka https://platform.openai.com/api-keys
2. Login atau daftar akun
3. Klik "Create new secret key"
4. Copy API key ke file .env

#### Google Gemini
1. Buka https://makersuite.google.com/app/apikey
2. Login dengan Google account
3. Klik "Create API key"
4. Copy API key ke file .env

## 📱 Cara Menggunakan

1. **Buka aplikasi** di browser
2. **Ketik pertanyaan** di kolom chat
3. **Tekan Enter** atau klik tombol kirim
4. **Lihat jawaban** dari AI
5. **Gunakan fitur**:
   - 📜 Lihat Riwayat: Melihat chat sebelumnya
   - 🗑️ Hapus Riwayat: Menghapus semua chat
   - 💡 Tips Bertanya: Panduan bertanya yang baik

## 💡 Tips Bertanya

- **Pelajaran**: "Jelaskan fotosintesis dengan mudah"
- **Matematika**: "Bagaimana cara menghitung luas lingkaran?"
- **Pengetahuan**: "Mengapa langit berwarna biru?"
- **Tugas**: "Bantu aku membuat ringkasan tentang..."

## 🛠️ Teknologi

- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript
- **AI**: OpenAI GPT-3.5 / Google Gemini
- **Database**: JSON file (untuk riwayat)
- **Deployment**: Docker, AWS EC2

## 📂 Struktur Project

```
ai-chatbot/
├── app.py              # Aplikasi Flask utama
├── requirements.txt    # Dependencies Python
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose
├── .env.example       # Template environment
├── README.md          # Dokumentasi
├── templates/
│   └── index.html     # Template HTML
└── static/
    ├── css/
    │   └── style.css  # Styling
    └── js/
        └── script.js  # JavaScript
```

## 🔒 Keamanan

- API key disimpan di environment variables
- Input validation untuk mencegah spam
- Rate limiting bisa ditambahkan
- HTTPS untuk production

## 🐛 Troubleshooting

### Error: API Key tidak valid
- Pastikan API key benar di file .env
- Cek quota API key masih tersedia

### Error: Koneksi gagal
- Pastikan internet tersambung
- Cek firewall tidak memblokir

### Error: Port sudah digunakan
```bash
# Cek port yang digunakan
sudo netstat -tulpn | grep :5000

# Kill process jika perlu
sudo kill -9 <PID>
```

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek dokumentasi ini
2. Lihat error message di terminal
3. Pastikan semua dependencies terinstall
4. Cek konfigurasi .env file

## 🎯 Pengembangan Selanjutnya

- [ ] Voice input/output
- [ ] Multiple language support
- [ ] User authentication
- [ ] Chat rooms
- [ ] File upload support
- [ ] Mobile app version