require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const Chat = require('./models/Chat');

// ── Existing Routes ──────────────────────────────────────────────────
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");
const authRoutes = require("./routes/authRoutes");
const riskRoutes = require("./routes/riskRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const chatRoutes = require("./routes/chatRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// ── New Module Routes ────────────────────────────────────────────────
const leadRoutes = require("./routes/leadRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const courseRoutes = require("./routes/courseRoutes");
const examRoutes = require("./routes/examRoutes");
const feeRoutes = require("./routes/feeRoutes");
const placementRoutes = require("./routes/placementRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// ── Middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health Check ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("SLCMS Backend 🚀 — All systems operational");
});

// ── Existing API Routes ───────────────────────────────────────────────
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ── New Module API Routes ─────────────────────────────────────────────
app.use("/api/leads", leadRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/analytics", analyticsRoutes);

// ── MongoDB Connection ────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ── Socket.io (Real-time Chat) ────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
  });

  socket.on('send_message', async (data) => {
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

// ── Start Server ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
