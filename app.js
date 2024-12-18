const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();
const signalRoutes = require('./Routes/signalRoutes');
const app = express();
const server = http.createServer(app);
const fs = require('fs')

// Use cors middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const ip = req.ip;
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Format timestamp
  const userAgent = req.get('User-Agent');
  const url = req.originalUrl;
  const method = req.method;

  const logMessage = `${timestamp}\t${ip}\t${method}\t${url}\tUser-Agent: ${userAgent}\n`;

  fs.appendFile('access_log.txt', logMessage, (err) => {
      if (err) {
          console.error('Error logging request:', err);
      }
  });

  next();
});




mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, 
})
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/app/p1', signalRoutes);
app.get("/healthz",(req,res)=>{
  res.status(201).json({
    success:true
  })
})

server.listen(process.env.PORT, () => {
  
});

module.exports = {
  app,
};
