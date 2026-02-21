const mongoose = require("mongoose");

// 1️⃣ DEFINE SCHEMA
const studentSchema = new mongoose.Schema(
  {
    _id: {
      type: String
    },
    studentId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    department: {
      type: String,
      required: true
    },

    currentSemester: {
      type: Number,
      required: true
    },

    lifecycleStage: {
      type: String,
      enum: ["Admission", "Academic", "Academics", "Placement", "Alumni", "Higher Studies"],
      default: "Admission"
    },

    attendancePercentage: {
      type: Number,
      default: 0
    },

    gpa: {
      type: Number,
      default: 0
    },

    riskStatus: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low"
    },

    lifeCycleIndex: {
      type: Number,
      default: 0
    },

    placementEligible: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// ⚠️ NO PRE-SAVE INTELLIGENCE LOGIC HERE
// Intelligence is handled ONLY in studentIntelligence.js

module.exports = mongoose.model("Student", studentSchema);
