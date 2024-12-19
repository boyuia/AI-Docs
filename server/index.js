const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', async (message) => {
        console.log(`Received: ${message}`);
        
        // Handle AI requests
        if (message.startsWith('/ai ')) {
            const query = message.replace('/ai ', '');
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: query,
                max_tokens: 150,
            });
            ws.send(response.data.choices[0].text);
        } else {
            // Broadcast message to all connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});