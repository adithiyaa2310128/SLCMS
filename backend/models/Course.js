const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true, min: 1, max: 6 },
    semester: { type: Number, required: true, min: 1, max: 8 },
    facultyName: { type: String, default: "" },
    facultyEmail: { type: String, default: "" },
    maxStudents: { type: Number, default: 60 },
    enrolledCount: { type: Number, default: 0 },
    timetable: [
      {
        day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
        startTime: String,
        endTime: String,
        room: String
      }
    ],
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
