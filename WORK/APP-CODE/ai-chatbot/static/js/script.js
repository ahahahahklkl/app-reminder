// Global variables
let isLoading = false;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    const questionInput = document.getElementById('questionInput');
    const charCount = document.getElementById('charCount');
    
    // Character counter
    questionInput.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = `${length}/500`;
        
        if (length > 450) {
            charCount.style.color = '#dc3545';
        } else if (length > 400) {
            charCount.style.color = '#ffc107';
        } else {
            charCount.style.color = '#666';
        }
    });
    
    // Enter key to send
    questionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });
    
    // Auto focus on input
    questionInput.focus();
});

// Send question to AI
async function sendQuestion() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim();
    
    if (!question || isLoading) {
        return;
    }
    
    if (question.length > 500) {
        showNotification('Pertanyaan terlalu panjang! Maksimal 500 karakter.', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Add user message to chat
    addMessage(question, 'user');
    
    // Clear input
    questionInput.value = '';
    document.getElementById('charCount').textContent = '0/500';
    
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Add AI response to chat
            addMessage(data.answer, 'ai', data.timestamp);
        } else {
            addMessage(data.error || 'Terjadi kesalahan saat memproses pertanyaan.', 'ai', null, true);
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Maaf, terjadi kesalahan koneksi. Coba lagi ya! 😅', 'ai', null, true);
    } finally {
        setLoadingState(false);
        questionInput.focus();
    }
}

// Add message to chat
function addMessage(content, sender, timestamp = null, isError = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    const currentTime = timestamp || new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    const messageClass = sender === 'user' ? 'user-message' : 'ai-message';
    
    messageDiv.className = `message ${messageClass}`;
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content ${isError ? 'error-message' : ''}">
            <p>${formatMessage(content)}</p>
            <span class="message-time">${currentTime}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message content
function formatMessage(content) {
    // Convert line breaks to <br>
    content = content.replace(/\n/g, '<br>');
    
    // Make text bold between **text**
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Make text italic between *text*
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return content;
}

// Set loading state
function setLoadingState(loading) {
    isLoading = loading;
    const sendButton = document.getElementById('sendButton');
    const sendIcon = document.getElementById('sendIcon');
    const loadingIcon = document.getElementById('loadingIcon');
    const questionInput = document.getElementById('questionInput');
    
    if (loading) {
        sendButton.disabled = true;
        sendIcon.style.display = 'none';
        loadingIcon.style.display = 'inline';
        loadingIcon.classList.add('loading');
        questionInput.disabled = true;
    } else {
        sendButton.disabled = false;
        sendIcon.style.display = 'inline';
        loadingIcon.style.display = 'none';
        loadingIcon.classList.remove('loading');
        questionInput.disabled = false;
    }
}

// Show chat history
async function showHistory() {
    const modal = document.getElementById('historyModal');
    const content = document.getElementById('historyContent');
    
    content.innerHTML = '<p>Memuat riwayat...</p>';
    modal.style.display = 'block';
    
    try {
        const response = await fetch('/history');
        const history = await response.json();
        
        if (history.length === 0) {
            content.innerHTML = '<p>Belum ada riwayat percakapan. Yuk mulai bertanya! 😊</p>';
            return;
        }
        
        let historyHTML = '';
        history.reverse().forEach(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleString('id-ID');
            
            historyHTML += `
                <div class="history-item">
                    <div class="history-question">❓ ${item.question}</div>
                    <div class="history-answer">🤖 ${formatMessage(item.answer)}</div>
                    <div class="history-time">⏰ ${timeStr}</div>
                </div>
            `;
        });
        
        content.innerHTML = historyHTML;
    } catch (error) {
        content.innerHTML = '<p>Gagal memuat riwayat. Coba lagi ya! 😅</p>';
    }
}

// Clear chat history
async function clearHistory() {
    if (!confirm('Yakin ingin menghapus semua riwayat percakapan?')) {
        return;
    }
    
    try {
        const response = await fetch('/clear-history', {
            method: 'POST'
        });
        
        const data = await response.json();
        showNotification(data.message || 'Riwayat berhasil dihapus!', 'success');
        
        // Clear chat messages except welcome message
        const chatMessages = document.getElementById('chatMessages');
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach((message, index) => {
            if (index > 0) { // Keep first welcome message
                message.remove();
            }
        });
        
    } catch (error) {
        showNotification('Gagal menghapus riwayat. Coba lagi ya! 😅', 'error');
    }
}

// Show tips modal
function showTips() {
    document.getElementById('tipsModal').style.display = 'block';
}

// Close tips modal
function closeTips() {
    document.getElementById('tipsModal').style.display = 'none';
}

// Close history modal
function closeHistory() {
    document.getElementById('historyModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const tipsModal = document.getElementById('tipsModal');
    const historyModal = document.getElementById('historyModal');
    
    if (event.target === tipsModal) {
        tipsModal.style.display = 'none';
    }
    if (event.target === historyModal) {
        historyModal.style.display = 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2em;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}