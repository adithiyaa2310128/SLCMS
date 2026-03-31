const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String, default: "" },
    department: { type: String, default: "" },
    block: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F", "Girls-Block"],
      required: true
    },
    roomNumber: { type: String, required: true },
    bedNumber: { type: Number, default: 1 },
    joinDate: { type: Date, default: Date.now },
    vacateDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Active", "Vacated", "Suspended"],
      default: "Active"
    },
    messPlan: {
      type: String,
      enum: ["Full", "Lunch-Dinner", "None"],
      default: "Full"
    },
    emergencyContact: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
