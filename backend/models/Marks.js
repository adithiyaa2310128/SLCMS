const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      ref: "Student",
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    marks: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marks", marksSchema);
