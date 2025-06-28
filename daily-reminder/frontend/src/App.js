import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ day: '', time: '', activity: '' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchReminders();
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get('/api/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.day || !form.time || !form.activity) return;
    
    try {
      await axios.post('/api/reminders', form);
      setForm({ day: '', time: '', activity: '' });
      fetchReminders();
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`/api/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const checkNotifications = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    reminders.forEach(reminder => {
      if (reminder.day === currentDay && reminder.time === currentTime) {
        showNotification(reminder.activity);
      }
    });
  };

  const showNotification = (activity) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Daily Reminder', {
          body: `Time for: ${activity}`,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Daily Reminder', {
              body: `Time for: ${activity}`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
    alert(`🔔 Reminder: ${activity}`);
  };

  return (
    <div className="app">
      <h1>Daily Reminder</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <select 
          value={form.day} 
          onChange={(e) => setForm({...form, day: e.target.value})}
          required
        >
          <option value="">Select Day</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({...form, time: e.target.value})}
          required
        />
        
        <input
          type="text"
          placeholder="Activity"
          value={form.activity}
          onChange={(e) => setForm({...form, activity: e.target.value})}
          required
        />
        
        <button type="submit">Add Reminder</button>
      </form>

      <div className="reminders">
        {reminders.map(reminder => (
          <div key={reminder.id} className="reminder-item">
            <span>{reminder.day} - {reminder.time}</span>
            <span>{reminder.activity}</span>
            <button onClick={() => deleteReminder(reminder.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;