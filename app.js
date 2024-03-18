const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();
const signalRoutes = require('./Routes/signalRoutes');
const app = express();
const server = http.createServer(app);

// Use cors middleware
app.use(cors());
app.use(express.json());

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
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = {
  app,
};
