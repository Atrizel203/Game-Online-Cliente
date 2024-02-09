import { useState, useEffect } from 'react';

const ChatGlobal = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const subscribeToChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/app/chat/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ lastIndex: messages.length }),
        });
  
        if (!response.ok) {
          console.error('Error subscribing to chat:', response.statusText);
          return;
        }
  
        const data = await response.json();

        setMessages(data.messages);
        subscribeToChat();
  
      } catch (error) {
        console.error('Error subscribing to chat:', error);
      }
    };
  
    subscribeToChat();
  }, []);

  const sendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/app/chat/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h2>Global Chat</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{escapeHtml(message)}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

// Función para escapar HTML en cadenas
const escapeHtml = (unsafe) => {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export default ChatGlobal;