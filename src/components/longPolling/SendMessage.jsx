import { useState } from 'react';

function SendMessage() {
 const [message, setMessage] = useState('');

 const handleSendMessage = async () => {
    try {
      await fetch('/publish', {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage('');
    } catch (error) {
      console.error(error);
    }
 };

 return (
    <div>
      <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
 );
}

export default SendMessage;