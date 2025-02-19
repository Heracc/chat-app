const API_URL = '/api/messages';

class ChatApp {
    constructor() {
        this.messagesContainer = document.getElementById('messages-container');
        this.messageForm = document.getElementById('message-form');
        this.messageInput = document.getElementById('message-input');
        
        this.setupEventListeners();
        this.loadMessages();
    }

    setupEventListeners() {
        this.messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.sendMessage();
        });

        // Support sending messages with Enter key
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: message,
                    sender: 'You',
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            this.addMessage({
                text: message,
                sender: 'You',
                timestamp: new Date().toISOString()
            });

            this.messageInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    }

    addMessage(messageData) {
        const messageElement = this.createMessageElement(messageData);
        this.messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom smoothly
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    createMessageElement(messageData) {
        const div = document.createElement('div');
        div.className = `message ${messageData.sender === 'You' ? 'sent' : 'received'}`;
        
        const time = new Date(messageData.timestamp).toLocaleTimeString();
        div.innerHTML = `
            <div class="message-text">${messageData.text}</div>
            <small class="message-time">${time}</small>
        `;
        
        return div;
    }

    async loadMessages() {
        try {
            const response = await fetch(API_URL);
            const messages = await response.json();
            
            messages.forEach(msg => this.addMessage(msg));
        } catch (error) {
            console.error('Error loading messages:', error);
            // Use mock messages if loading fails
            const mockMessages = [
                { 
                    text: "Welcome to the chat!", 
                    sender: "System", 
                    timestamp: new Date().toISOString() 
                }
            ];
            mockMessages.forEach(msg => this.addMessage(msg));
        }
    }
}

// Initialize the chat app
document.addEventListener('DOMContentLoaded', () => {
    const chatApp = new ChatApp();
});
