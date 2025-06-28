import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ day: '', time: '', activity: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAIChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/ai-chat', { message: chatMessage });
      setChatResponse(response.data.message);
      
      if (response.data.success) {
        fetchReminders(); // Refresh list
        setChatMessage(''); // Clear input
      }
    } catch (error) {
      setChatResponse('Maaf, ada error. Coba lagi ya!');
      console.error('Error with AI chat:', error);
    }
    setIsLoading(false);
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`/api/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const checkNotifications = async () => {
    try {
      const response = await axios.get('/api/reminders');
      const currentReminders = response.data;
      
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toTimeString().slice(0, 5);
      
      console.log(`Frontend checking: ${currentDay} ${currentTime}`);
      
      currentReminders.forEach(reminder => {
        if (reminder.day === currentDay && reminder.time === currentTime) {
          console.log('🔔 NOTIFICATION TRIGGERED:', reminder.activity);
          showNotification(reminder.activity);
        }
      });
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const showNotification = (activity) => {
    // Speak notification
    speakText(`Hei, waktunya ${activity}`);

    // Browser notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('AI Reminder Assistant', {
          body: `Waktunya: ${activity}`,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('AI Reminder Assistant', {
              body: `Waktunya: ${activity}`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
    
    alert(`🤖 AI Reminder: Waktunya ${activity}!`);
  };

  return (
    <div className="app">
      <h1>🤖 AI Reminder Assistant</h1>
      
      {/* AI Chat Section */}
      <div className="ai-chat-section" style={{marginBottom: '30px', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '2px solid #007bff'}}>
        <h3 style={{marginBottom: '15px', color: '#007bff'}}>💬 Chat dengan AI</h3>
        <form onSubmit={handleAIChat} style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Contoh: Ingetin aku besok jam 9 meeting dengan tim"
            style={{flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            {isLoading ? '🤔' : '🚀'} Kirim
          </button>
        </form>
        
        {chatResponse && (
          <div style={{padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd'}}>
            <strong>🤖 AI:</strong> {chatResponse}
          </div>
        )}
        
        <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
          <strong>Tips:</strong> Coba kata seperti "besok", "senin", "jam 9", "meeting", "belajar", dll.
        </div>
      </div>

      {/* Manual Form */}
      <details style={{marginBottom: '20px'}}>
        <summary style={{cursor: 'pointer', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '4px'}}>
          📝 Manual Input (Klik untuk buka)
        </summary>
        <form onSubmit={handleSubmit} className="form" style={{marginTop: '10px'}}>
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
      </details>

      {/* Reminders List */}
      <div className="reminders">
        <h3>📅 Jadwal Kamu:</h3>
        {reminders.length === 0 ? (
          <p style={{color: '#666', fontStyle: 'italic'}}>Belum ada jadwal. Chat dengan AI untuk menambah!</p>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className="reminder-item">
              <span>{reminder.day} - {reminder.time}</span>
              <span>{reminder.activity}</span>
              <button onClick={() => deleteReminder(reminder.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;