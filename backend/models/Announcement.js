const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ["General", "Urgent", "Academic", "Finance", "Placement", "Event"],
      default: "General"
    },
    targetAudience: {
      type: String,
      enum: ["All", "Students", "Faculty", "Staff"],
      default: "All"
    },
    department: { type: String, default: "All" },
    createdBy: { type: String, default: "Admin" },
    expiresAt: { type: Date, default: null },
    isPinned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
