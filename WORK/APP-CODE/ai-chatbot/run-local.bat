@echo off
echo 🤖 Starting AI Teman Belajar...

echo 📦 Installing dependencies...
pip install -r requirements.txt

echo 🔧 Checking .env file...
if not exist .env (
    echo ⚠️  File .env tidak ditemukan!
    echo 📝 Copying .env.example to .env...
    copy .env.example .env
    echo ✅ Silakan edit file .env dan isi API key Anda
    echo 🔑 OpenAI: https://platform.openai.com/api-keys
    echo 🔑 Gemini: https://makersuite.google.com/app/apikey
    pause
)

echo 🚀 Starting application...
python app.py

pause