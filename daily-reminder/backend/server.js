const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

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

// Notification checker (runs every minute)
cron.schedule('* * * * *', () => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5);
  
  db.all('SELECT * FROM reminders WHERE day = ? AND time = ?', 
    [currentDay, currentTime], (err, rows) => {
    if (err) return;
    rows.forEach(reminder => {
      console.log(`🔔 REMINDER: ${reminder.activity} at ${reminder.time}`);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});