import { useEffect, useState } from 'react';

function Chat() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function subscribe() {
            try {
                const response = await fetch('/subscribe');
                if (response.status === 200) {
                    const message = await response.json();
                    setMessages(oldMessages => [...oldMessages, message]);
                    subscribe();
                } else {
                    throw new Error('Error during subscription');
                }
            } catch (error) {
                console.error(error);
                setTimeout(subscribe, 5000);
            }
        }

        subscribe();
    }, []);

    return (
        <div>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
    );
}

export default Chat;