from flask import Flask, render_template, request, jsonify
import os
import json
import datetime
from dotenv import load_dotenv
import openai
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)

class AIChat:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.ai_provider = os.getenv('AI_PROVIDER', 'openai')
        self.chat_history = []
        self.load_history()
    
    def load_history(self):
        """Load chat history from file"""
        try:
            if os.path.exists('chat_history.json'):
                with open('chat_history.json', 'r', encoding='utf-8') as f:
                    self.chat_history = json.load(f)
        except Exception as e:
            print(f"Error loading history: {e}")
            self.chat_history = []
    
    def save_history(self):
        """Save chat history to file"""
        try:
            with open('chat_history.json', 'w', encoding='utf-8') as f:
                json.dump(self.chat_history, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving history: {e}")
    
    def ask_openai(self, question):
        """Send question to OpenAI GPT"""
        try:
            client = openai.OpenAI(api_key=self.openai_api_key)
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Kamu adalah asisten AI yang ramah dan membantu anak-anak sekolah. Jawab dengan bahasa yang mudah dipahami dan menyenangkan."},
                    {"role": "user", "content": question}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Maaf, terjadi kesalahan: {str(e)}"
    
    def ask_gemini(self, question):
        """Send question to Google Gemini"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_api_key}"
            
            headers = {
                'Content-Type': 'application/json',
            }
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": f"Kamu adalah asisten AI yang ramah dan membantu anak-anak sekolah. Jawab dengan bahasa yang mudah dipahami dan menyenangkan. Pertanyaan: {question}"
                    }]
                }]
            }
            
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            return f"Maaf, terjadi kesalahan: {str(e)}"
    
    def get_answer(self, question):
        """Get answer from selected AI provider"""
        if self.ai_provider == 'gemini' and self.gemini_api_key:
            answer = self.ask_gemini(question)
        elif self.openai_api_key:
            answer = self.ask_openai(question)
        else:
            answer = "Maaf, API key belum dikonfigurasi. Silakan periksa file .env"
        
        # Save to history
        chat_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "question": question,
            "answer": answer,
            "provider": self.ai_provider
        }
        
        self.chat_history.append(chat_entry)
        self.save_history()
        
        return answer

# Initialize AI Chat
ai_chat = AIChat()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask_question():
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        
        if not question:
            return jsonify({'error': 'Pertanyaan tidak boleh kosong!'}), 400
        
        answer = ai_chat.get_answer(question)
        
        return jsonify({
            'question': question,
            'answer': answer,
            'timestamp': datetime.datetime.now().strftime('%H:%M:%S')
        })
    
    except Exception as e:
        return jsonify({'error': f'Terjadi kesalahan: {str(e)}'}), 500

@app.route('/history')
def get_history():
    return jsonify(ai_chat.chat_history[-10:])  # Return last 10 chats

@app.route('/clear-history', methods=['POST'])
def clear_history():
    ai_chat.chat_history = []
    ai_chat.save_history()
    return jsonify({'message': 'Riwayat chat berhasil dihapus!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)