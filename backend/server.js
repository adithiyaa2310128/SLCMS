require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");
const authRoutes = require("./routes/authRoutes");
const riskRoutes = require("./routes/riskRoutes");


const http = require('http');
const { Server } = require('socket.io');
const Chat = require('./models/Chat');

const alumniRoutes = require("./routes/alumniRoutes");
const chatRoutes = require("./routes/chatRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// student routes
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('send_message', async (data) => {
    // data: { room, message, senderId, senderName }
    try {
      const newChat = new Chat({
        room: data.room,
        message: data.message,
        senderId: data.senderId,
        senderName: data.senderName
      });
      await newChat.save();

      io.to(data.room).emit('receive_message', newChat);
    } catch (err) {
      console.error("Error saving chat:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
