import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    const handleChatInputChange = (e) => {
        setChatInput(e.target.value);
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (chatInput.trim()) {
            const userMessage = { sender: 'User', text: chatInput };
            setChatMessages([...chatMessages, userMessage]);

            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/engines/davinci-codex/completions',
                    {
                        prompt: chatInput,
                        max_tokens: 150,
                        n: 1,
                        stop: null,
                        temperature: 0.7,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer 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`,
                        },
                    }
                );

                const aiMessage = { sender: 'AI', text: response.data.choices[0].text.trim() };
                setChatMessages((prevMessages) => [...prevMessages, aiMessage]);
            } catch (error) {
                console.error('Error fetching AI response:', error);
            }

            setChatInput('');
        }
    };

    return (
        <div className="chat-container">
            <h2>AI Chat</h2>
            <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleChatSubmit}>
                <input
                    type="text"
                    value={chatInput}
                    onChange={handleChatInputChange}
                    placeholder="Ask the AI..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;