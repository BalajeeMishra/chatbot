const express= require("express");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(app);
const OpenAI  = require("openai")
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const chatHistory = [];
io.on("connection", (socket) => {
  console.log("socket connectedd");
  socket.on("sendMessage", async (data) => {
    if(data.message){
    chatHistory.push({ role: "user", content: data.message });
    
    const chatCompletion = await openai.chat.completions.create({
      messages: chatHistory,
      model: 'gpt-3.5-turbo',
    });
    socket.emit("receiveMessage", {
      message: `${chatCompletion.choices[0].message.content}`,
    });
    chatHistory.push(chatCompletion.choices[0].message);
  }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

httpServer.listen(5000, () => {
  console.log("Server listening on port 5000");
});