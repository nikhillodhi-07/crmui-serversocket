const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3001;

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

// Helper to normalize room names (lowercase/trim/sort)
function normalizeName(name) {
  return (name || '').trim().toLowerCase();
}
function getRoomName(userA, userB) {
  return [normalizeName(userA), normalizeName(userB)].sort().join('_');
}

io.on('connection', (socket) => {
  console.log('[Socket.IO] User connected:', socket.id);

  socket.on('joinRoom', ({ room }) => {
    console.log('[Socket.IO] joinRoom:', room, 'Socket:', socket.id);
    socket.join(room);
  });

  socket.on('sendMessage', (msg) => {
    if (msg.room) {
      console.log('[Socket.IO] sendMessage to room:', msg.room, 'Message:', msg);
      io.to(msg.room).emit('receiveMessage', msg);
    }
  });

  socket.on('leaveRoom', ({ room }) => {
    console.log('[Socket.IO] leaveRoom:', room, 'Socket:', socket.id);
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    console.log('[Socket.IO] User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
