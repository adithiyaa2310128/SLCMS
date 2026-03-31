const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, default: "" },
    department: { type: String, default: "" },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    type: {
      type: String,
      enum: ["Internship", "Full-Time", "Contract", "Part-Time"],
      default: "Full-Time"
    },
    ctc: { type: Number, default: 0 }, // in LPA
    stipend: { type: Number, default: 0 }, // for internships, monthly
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected", "Withdrawn"],
      default: "Applied"
    },
    driveDate: { type: Date, default: null },
    offerLetterSent: { type: Boolean, default: false },
    joiningDate: { type: Date, default: null },
    location: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);
