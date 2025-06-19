const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Izinkan koneksi dari mana saja
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Saat presenter mengirim offer
  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
    console.log('Offer broadcasted');
  });

  // Saat viewer mengirim answer
  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);
    console.log('Answer broadcasted');
  });

  // Untuk bertukar ICE candidates
  socket.on('candidate', (data) => {
    socket.broadcast.emit('candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
