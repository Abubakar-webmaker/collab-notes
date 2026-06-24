const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const noteHandler = require('./socket/noteHandler');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (
        origin.includes('vercel.app') ||
        origin === 'http://localhost:5173'
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.includes('vercel.app') ||
      origin === 'http://localhost:5173'
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
app.use(express.json());

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  noteHandler(io, socket);
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log(err));