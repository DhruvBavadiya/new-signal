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
mongoose.connect(process.env.DB_URL).then(() => {
  console.log('mongoose connected');
});

io.on('connection', (socket) => {
  console.log('Client connected');
  // Additional logic for client connection, if needed
});

app.use('/app/p1', signalRoutes);
app.get("/healthz",(req,res)=>{
  res.status(201).json({
    success:true
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = {
  app,
  io,
};
