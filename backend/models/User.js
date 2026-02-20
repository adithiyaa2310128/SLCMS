const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["Admin", "Student", "Alumni"],
      default: "Student"
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },

    // Alumni Fields
    isAlumni: {
      type: Boolean,
      default: false
    },
    company: {
      type: String
    },
    jobRole: {
      type: String
    },
    batch: {
      type: String
    },
    linkedin: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
