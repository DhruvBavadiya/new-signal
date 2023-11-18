const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors'); // Import the cors middleware
const socketIO = require('socket.io');
require('dotenv').config();
const signalRoutes = require('./Routes/signalRoutes');
const app = express();
const server = http.createServer(app);
const io = socketIO(server); // Create a Socket.IO instance

// Use cors middleware
app.use(cors());
app.use(express.json());

// mongoose connections.
mongoose.connect('mongodb+srv://bavadiyadhruv:TL1zO2Vscn4QMTA1@databse1.1iownrz.mongodb.net/').then(() => {
  console.log('mongoose connected');
});

io.on('connection', (socket) => {
  console.log('Client connected');
  // Additional logic for client connection, if needed
});

app.use('/app/p1', signalRoutes);

server.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});

module.exports = {
  app,
  io, // Export the io object
  // Any other exports you may need
};
