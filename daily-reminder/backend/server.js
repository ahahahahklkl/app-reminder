const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./reminders.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    activity TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Routes
app.get('/api/reminders', (req, res) => {
  db.all('SELECT * FROM reminders ORDER BY day, time', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/reminders', (req, res) => {
  const { day, time, activity } = req.body;
  db.run('INSERT INTO reminders (day, time, activity) VALUES (?, ?, ?)', 
    [day, time, activity], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, day, time, activity });
  });
});

app.delete('/api/reminders/:id', (req, res) => {
  db.run('DELETE FROM reminders WHERE id = ?', req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// AI Chat endpoint
app.post('/api/ai-chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    // Simple AI parsing (without OpenAI for now)
    const reminder = parseReminderFromText(message);
    
    if (reminder.day && reminder.time && reminder.activity) {
      // Save to database
      db.run('INSERT INTO reminders (day, time, activity) VALUES (?, ?, ?)', 
        [reminder.day, reminder.time, reminder.activity], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          success: true,
          message: `Oke! Aku akan ingetin kamu ${reminder.activity} pada hari ${reminder.day} jam ${reminder.time}`,
          reminder: { id: this.lastID, ...reminder }
        });
      });
    } else {
      res.json({ 
        success: false,
        message: "Maaf, aku belum paham. Coba tulis seperti: 'Ingetin aku besok jam 9 meeting'"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple AI parser function
function parseReminderFromText(text) {
  const lowerText = text.toLowerCase();
  
  // Parse day
  let day = '';
  const days = {
    'senin': 'Monday', 'monday': 'Monday',
    'selasa': 'Tuesday', 'tuesday': 'Tuesday', 
    'rabu': 'Wednesday', 'wednesday': 'Wednesday',
    'kamis': 'Thursday', 'thursday': 'Thursday',
    'jumat': 'Friday', 'friday': 'Friday',
    'sabtu': 'Saturday', 'saturday': 'Saturday',
    'minggu': 'Sunday', 'sunday': 'Sunday',
    'besok': getTomorrowDay(),
    'hari ini': getTodayDay()
  };
  
  for (const [key, value] of Object.entries(days)) {
    if (lowerText.includes(key)) {
      day = value;
      break;
    }
  }
  
  // Parse time
  let time = '';
  const timeMatch = lowerText.match(/(\d{1,2})(?:[:.]?(\d{2}))?\s*(?:am|pm)?|jam\s*(\d{1,2})/);
  if (timeMatch) {
    const hour = timeMatch[1] || timeMatch[3];
    const minute = timeMatch[2] || '00';
    time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }
  
  // Parse activity
  let activity = '';
  const activityKeywords = ['meeting', 'rapat', 'belajar', 'kerja', 'olahraga', 'makan', 'tidur'];
  for (const keyword of activityKeywords) {
    if (lowerText.includes(keyword)) {
      activity = keyword;
      break;
    }
  }
  
  // If no specific activity found, extract from context
  if (!activity) {
    const words = text.split(' ');
    const stopWords = ['ingetin', 'aku', 'besok', 'jam', 'pada', 'hari', 'untuk'];
    activity = words.filter(word => !stopWords.includes(word.toLowerCase()) && !Object.keys(days).includes(word.toLowerCase()) && !word.match(/\d/)).join(' ');
  }
  
  return { day, time, activity };
}

function getTodayDay() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function getTomorrowDay() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
}

// Notification checker (runs every minute)
cron.schedule('* * * * *', () => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5);
  
  console.log(`[${new Date().toISOString()}] Checking: ${currentDay} at ${currentTime}`);
  
  db.all('SELECT * FROM reminders', (err, allRows) => {
    if (err) {
      console.log('DB Error:', err);
      return;
    }
    console.log('All reminders in DB:', allRows);
  });
  
  db.all('SELECT * FROM reminders WHERE day = ? AND time = ?', 
    [currentDay, currentTime], (err, rows) => {
    if (err) {
      console.log('Query Error:', err);
      return;
    }
    console.log(`Found ${rows.length} matching reminders for ${currentDay} ${currentTime}`);
    rows.forEach(reminder => {
      console.log(`🔔 REMINDER: ${reminder.activity} at ${reminder.time}`);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});