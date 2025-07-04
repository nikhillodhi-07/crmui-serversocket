// socket-server.js
const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, { cors: { origin: '*' } });

// Helper to normalize room names (lowercase/trim/sort)
function normalizeName(name) {
  return (name || '').trim().toLowerCase();
}
function getRoomName(userA, userB) {
  return [normalizeName(userA), normalizeName(userB)].sort().join('_');
}

io.on('connection', (socket) => {
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
});

server.listen(3001, () => {
  console.log('Socket.IO server running on port 3001');
});
