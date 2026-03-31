const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    source: {
      type: String,
      enum: ["Website", "Event", "Campaign", "Referral", "Social Media", "Walk-in", "Other"],
      default: "Website"
    },
    program: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Applied", "Enrolled", "Dropped"],
      default: "New"
    },
    leadScore: { type: Number, default: 0, min: 0, max: 100 },
    assignedTo: { type: String, default: "" },
    notes: [
      {
        text: String,
        addedAt: { type: Date, default: Date.now }
      }
    ],
    followUpDate: { type: Date, default: null },
    campaign: { type: String, default: "" }
  },
  { timestamps: true }
);

// Auto-compute lead score on save
leadSchema.pre("save", function (next) {
  let score = 0;
  if (this.email) score += 20;
  if (this.phone) score += 15;
  if (this.program) score += 15;
  const statusBonus = { New: 10, Contacted: 30, Interested: 50, Applied: 70, Enrolled: 90, Dropped: 0 };
  score += statusBonus[this.status] || 0;
  this.leadScore = Math.min(100, score);
  next();
});

module.exports = mongoose.model("Lead", leadSchema);
