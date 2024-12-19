import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Chat from './Chat';

const App = () => {
    const [content, setContent] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            const message = event.data;
            if (message.startsWith('AI: ')) {
                setChatMessages((prev) => [...prev, { sender: 'AI', text: message.replace('AI: ', '') }]);
            } else {
                setContent(message);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const handleEditorChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        ws.current.send(newContent);
    };

    const handleChatInputChange = (e) => {
        setChatInput(e.target.value);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        ws.current.send(`/ai ${chatInput}`);
        setChatMessages((prev) => [...prev, { sender: 'User', text: chatInput }]);
        setChatInput('');
    };

    const applyFormat = (format) => {
        document.execCommand(format);
    };

    return (
        <div className="App">
            <h1>AI Docs</h1>
            <textarea
                value={content}
                onChange={handleEditorChange}
                rows="20"
                cols="80"
            />
              <div className="toolbar">
                <button onClick={() => applyFormat('bold')}>Bold</button>
                <button onClick={() => applyFormat('italic')}>Italic</button>
                <button onClick={() => applyFormat('underline')}>Underline</button>
                <button onClick={() => applyFormat('Color')}>Color</button>
            </div>
            <div
                className="editor"
                contentEditable
                onInput={handleEditorChange}
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          <Chat />
          </div>
    );
};

export default App;