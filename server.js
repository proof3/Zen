import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import Model from './Model.js';
import { getImageDataFromUrl, compressImageBuffer } from './ImageUtils.js';
import { chatSystemMessage } from './prompts.js';
import serviceSchema from './schema.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = http.createServer(app);
// Initialize Socket.IO with the server
const io = new Server(server); 

const PORT = process.env.PORT || 3000;

// Serve the static index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.IO logic for connections
io.on('connection', (socket) => {
  console.log('A user connected');

  //create 2 chat instances for image generation and text.
  const modelAssistant = new Model(new ChatGoogleGenerativeAI({
  	model: "gemini-2.5-flash-lite",
    maxOutputTokens: 2048,	
  }).withStructuredOutput(serviceSchema));

  const modelImage = new Model(new ChatGoogleGenerativeAI({
  	model: "gemini-2.5-flash-image",
  	maxOutputTokens: 2048,
  }));


  modelAssistant.addTextprompt(chatSystemMessage);
  const assistantChain = modelAssistant.createChain();
  if (assistantChain == undefined) {
    console.log("error");
    return;
  }

  // Listen for 'chat message' events from the client
  socket.on('chat message', async (msg) => {
    const strMsg = msg.text;
    console.log('message: ' + strMsg);
    
    // Emit the message to all connected clients
    io.emit('chat message', msg);
    const response = await assistantChain.invoke({userInput: strMsg});
    console.log('response: ' + response.service + " " + response.output);
    io.emit('chat message', response);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
